import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API route to transform loose speech into structured prompts
app.post("/api/transform-prompt", async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    const systemInstruction = `You are a master of Prompt Engineering (2026 Edition). 
Your task is to take a "loose", informal, or spoken request and transform it into a highly structured, professional prompt using the Prompt Combiner Formula.

Formula: Role + Constraints + Technique + Examples + Task + Format + Self-Check

Output strictly the generated prompt string. Do not add any preamble or explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: input,
      config: {
        systemInstruction,
      },
    });

    res.json({ prompt: response.text });
  } catch (error: any) {
    console.error("Error transforming prompt:", error);
    res.status(500).json({ error: error.message || "Failed to transform prompt" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
