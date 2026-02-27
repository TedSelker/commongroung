import { GoogleGenAI } from "@google/genai";

export interface Commonality {
  topic: string;
  type: 'personal' | 'professional';
  description: string;
  collaborationIdea: string;
}

export async function findCommonGround(person1: string, person2: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const prompt = `Find 3 to 5 prioritized things that ${person1} and ${person2} have in common. 
  These should be topics for conversation or, more importantly, collaboration.
  Include at least one personal topic (hobbies, background, values) and at least one professional topic (skills, industries, goals).
  
  CRITICAL: Keep the output extremely concise. For each topic, provide:
  1. The topic name.
  2. Whether it is 'personal' or 'professional'.
  3. A brief description of why they share this (maximum 1-2 sentences).
  4. A specific idea for how they could collaborate on this (maximum 1-2 sentences).

  Use Google Search to find accurate information about these individuals if they are public figures. 
  If they are not well-known, provide general potential commonalities while still offering high-quality "icebreaker" commonalities.
  
  Format the output clearly using Markdown.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text || "No common ground found.";
}
