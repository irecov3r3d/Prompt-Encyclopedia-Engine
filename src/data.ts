export interface Technique {
  name: string;
  keywords: string;
  usage: string;
  example: string;
}

export interface Modifier {
  type: string;
  keywords: string;
  effect: string;
  example: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'Reasoner' | 'Critique' | 'Multi-Perspective' | 'Agent' | 'Code';
}

export interface AntiPattern {
  name: string;
  symptom: string;
  fix: string;
}

export const TECHNIQUES: Technique[] = [
  {
    name: "Zero-shot",
    keywords: "-",
    usage: "Simple, known tasks",
    example: "Classify this review as positive or negative: 'Product broke in 2 days.'"
  },
  {
    name: "Few-shot",
    keywords: "Here are examples:, Follow this pattern:, Like these:",
    usage: "Pattern matching, style mimicry",
    example: "Q: 2+2=?\nA: 4\nQ: 5+7=?\nA: 12\nQ: 9+3=?"
  },
  {
    name: "Chain-of-Thought (CoT)",
    keywords: "Think step by step, reason step-by-step, Explain your reasoning",
    usage: "Math, logic, planning",
    example: "Solve 17×24. Think step by step before answering."
  },
  {
    name: "Self-Consistency",
    keywords: "Generate 5 different reasoning paths, Take the majority vote",
    usage: "Reduce variance on ambiguous tasks",
    example: "Answer the riddle 3 times independently, then choose the most common."
  },
  {
    name: "Tree-of-Thoughts",
    keywords: "Explore 3 possible approaches, branch into options, evaluate each path",
    usage: "Complex search/planning",
    example: "To plan a trip to Tokyo, explore 3 budget strategies, score each 1–10."
  },
  {
    name: "ReAct",
    keywords: "Think, Act, Observe loop",
    usage: "Agentic/tool-use tasks",
    example: "You can search the web. To answer: Think → Act[search query] → Observe → …"
  },
  {
    name: "Chain-of-Symbol",
    keywords: "↑ ↓ → [CHECK] [PLAN]",
    usage: "Spatial, visual, optimization tasks",
    example: "Navigate maze: [START] → [RIGHT] ↑ [UP] [CHECK wall]"
  }
];

export const OUTPUT_CONTROLS: Modifier[] = [
  {
    type: "Strict format",
    keywords: "Output ONLY in JSON, Use exact template",
    effect: "Machine-readable",
    example: "Respond in JSON: {score: 1-10, reasoning: str}"
  },
  {
    type: "Length",
    keywords: "Exactly 3 sentences, < 100 words",
    effect: "Conciseness",
    example: "Summarize in exactly 50 words."
  },
  {
    type: "Tone / Style",
    keywords: "Professional yet witty, Like Hemingway",
    effect: "Voice control",
    example: "Explain quantum entanglement like a stand-up comedian."
  }
];

export const ANTI_PATTERNS: AntiPattern[] = [
  {
    name: "Vague one-liner",
    symptom: "Generic / useless output",
    fix: "Add role + context + format + example"
  },
  {
    name: "Overloaded mega-prompt",
    symptom: "Ignores half the instructions",
    fix: "Split into chain or multi-turn"
  },
  {
    name: "No clear ask",
    symptom: "AI summarizes instead of solving",
    fix: "End with explicit question / command"
  }
];

export const TEMPLATES: Template[] = [
  {
    id: "expert-reasoner",
    title: "Expert Reasoner",
    description: "Multi-decade PhD level reasoning for complex problem solving.",
    category: "Reasoner",
    content: `You are a {domain} PhD with 20+ years experience. Use high reasoning effort. Think step-by-step. Never hallucinate — base only on provided info or established facts.

Task: {clear task}

{context / data}

Output format:
1. Step-by-step reasoning
2. Final answer in \`\`\`boxed{answer}\`\`\``
  },
  {
    id: "critique-improve",
    title: "Critique & Improve",
    description: "Drafting, harsh editing, and final polished output cycle.",
    category: "Critique",
    content: `First, generate a draft answer to: {task}

Then, act as a world-class editor. Critique harshly: logical gaps, tone, completeness, accuracy.

Finally, output the improved version.`
  },
  {
    id: "multi-perspective",
    title: "Multi-Perspective",
    description: "Synthesize balanced answers from conflicting viewpoints.",
    category: "Multi-Perspective",
    content: `Answer from 3 viewpoints:
A) Optimistic startup founder
B) Skeptical VC
C) Neutral academic researcher

Then synthesize the best balanced response.`
  },
  {
    id: "json-agent",
    title: "JSON Agent Strict",
    description: "Precise machine-readable tool calling agent.",
    category: "Agent",
    content: `You are a precise tool-calling agent. Respond ONLY with valid JSON in this schema:

{
  "thought": "your internal reasoning",
  "action": "search_web" or "final_answer",
  "input": "query or answer"
}

Never add extra text outside the JSON.`
  },
  {
    id: "code-review",
    title: "Code Review Master",
    description: "L8 Senior Engineer level code analysis.",
    category: "Code",
    content: `You are GitHub's top senior engineer (ex-Google L8).

Review this code:

\`\`\`python
{code}
\`\`\`

Report in table: | Issue | Severity | Line | Explanation | Suggested Fix | Follow with full improved code.`
  }
];
