import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
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
Your task is to take a "loose", informal, or spoken request and transform it into a highly structured, professional prompt using the Prompt Combiner Formula components.

Analyze the user's intent to extract or extrapolate:
- A hyper-specific expert persona Role.
- Robust constraints or anti-hallucination guardrails.
- The single most logical 2026 reasoning technique (e.g., Chain-of-Thought, ReAct, Self-Consistency).
- A few-shot template or realistic input-output examples if beneficial/applicable (keep concise).
- The exact task/objective.
- The optimum output style, template format, or structured schema.

Provide all of these structured variables inside the JSON response matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: input,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: {
              type: Type.STRING,
              description: "The ideal persona role with high authority (e.g. 'Senior PhD researcher with 20+ years of industrial experience')."
            },
            constraints: {
              type: Type.STRING,
              description: "Anti-hallucination guardrails, forbidden actions, or strict rules (e.g. 'Never extrapolate. Base answers strictly on contextual facts')."
            },
            technique: {
              type: Type.STRING,
              description: "A reasoning model technique to recommend, such as 'Chain-of-Thought strategy', 'Tree-of-thoughts', or 'Few-shot pattern matching'."
            },
            examples: {
              type: Type.STRING,
              description: "A short input -> output prompt example to guide the model, or empty if not needed."
            },
            task: {
              type: Type.STRING,
              description: "A precise, clean rendering of the main task/objective."
            },
            format: {
              type: Type.STRING,
              description: "Desired output template structural formatting rules (e.g. 'markdown hierarchy', 'valid raw JSON')."
            }
          },
          required: ["role", "constraints", "technique", "examples", "task", "format"]
        }
      },
    });

    try {
      const data = JSON.parse(response.text);
      res.json(data);
    } catch (e) {
      console.error("JSON parsing error on response text:", response.text);
      res.json({ 
        role: "Expert Prompt Engineer with 20 years domain depth",
        constraints: "Never hallucinate. Stick to concrete data inputs.",
        technique: "Step-by-step Chain-of-Thought reasoning",
        examples: "Input: raw thoughts -> Output: optimized code",
        task: input,
        format: "A masterfully parsed hierarchical prompt draft"
      });
    }
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
