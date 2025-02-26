import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import fs from "fs/promises";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
const filePath = path.join(__dirname, "/datap.json");
const fileData = await fs.readFile(filePath, "utf-8");

async function aiReq(prompt) {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a quiz generator. Format responses with questions separated by '***', " +
          "options marked with letters, and answers separated by '---'. Number all questions and answers.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 1000,
    model: modelName,
  });

  return response.choices[0].message.content;
}

async function generateQuizQuestions() {
  const prompt = `Generate 10 basic quiz questions from${fileData} with 4 multiple-choice options each. 
Format like this:

***1. Question text here?
A) Option 1
B) Option 2
C) Option 3
D) Option 4

***2. Next question...
---
Answers:
1. A
2. B`;

  return aiReq(prompt);
}

function parseQuestions(rawQuestions) {
  return rawQuestions
    .split("***")
    .filter((q) => q.trim())
    .map((qBlock) => {
      const lines = qBlock.split("\n").filter((l) => l.trim());
      const header = lines.shift();
      const questionMatch = header?.match(/^(\d+)[.)]\s*(.+)/);

      if (!questionMatch) return null;

      const options = lines
        .filter((line) => /^[A-D][.)]\s*/i.test(line))
        .map((line) => line.replace(/^[A-D][.)]\s*/i, "").trim());

      return {
        number: parseInt(questionMatch[1]),
        question: questionMatch[2].trim(),
        options: options,
      };
    })
    .filter((q) => q);
}

function parseAnswers(rawAnswers) {
  return rawAnswers
    .split("\n")
    .filter((l) => l.trim())
    .reduce((acc, line) => {
      const match = line.match(/^(\d+)[.)]\s*([A-D])/i); // Handles both . and )
      if (match) {
        acc[match[1]] = match[2].toUpperCase();
      }
      return acc;
    }, {});
}

async function main() {
  let quizData = [];
  try {
    const quizResponse = await generateQuizQuestions();
    console.log("Raw AI Response:\n", quizResponse);

    if (!quizResponse.includes("---")) {
      throw new Error("AI response missing answer separator '---'");
    }

    const [questionsSection, answersSection] = quizResponse
      .split("---")
      .map((s) => s.trim());

    const questions = parseQuestions(questionsSection);
    const answerMap = parseAnswers(answersSection);

    quizData = questions.map((q) => {
      const answerLetter = answerMap[q.number];
      if (!answerLetter || !q.options)
        return { ...q, correctAnswer: "Unknown" };

      const optionIndex = answerLetter.charCodeAt(0) - "A".charCodeAt(0);
      return {
        ...q,
        correctAnswer: q.options[optionIndex] || "Invalid Answer",
      };
    });

    console.log("Structured Quiz Data:", JSON.stringify(quizData, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
  return quizData;
}

const app = express();
const port = 3000;
app.use(cors());
app.listen(port, () => console.log(`Server running on port ${port}`));
app.get("/quiz", async (req, res) => {
  try {
    const data = await main();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});
