import type { Express } from "express";
import type { Server } from "http";
import Anthropic from "@anthropic-ai/sdk";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/analyze-image', async (req, res) => {
    const { base64Image, mediaType } = req.body;
    if (!base64Image || !mediaType) {
      return res.status(400).json({ error: 'base64Image and mediaType are required' });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `Analyze this image comprehensively. Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "description": "A detailed 2-3 sentence description of the image",
  "objects": ["object1", "object2", "object3"],
  "text_content": ["any visible text line 1", "line 2"],
  "emotions": {
    "mood": "overall mood in 2-4 words",
    "indicators": ["indicator1", "indicator2", "indicator3"]
  },
  "context": "1-2 sentences about the likely context or purpose of this image",
  "colors": {
    "dominant": ["color name 1", "color name 2", "color name 3"],
    "palette_mood": "2-3 word description of the color mood"
  },
  "composition": "1 sentence about framing, lighting, or composition",
  "insights": "1-2 interesting observations or details about this image",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                  data: base64Image,
                },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      });

      const text = (response.content[0] as { type: string; text: string }).text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");
      const analysis = JSON.parse(jsonMatch[0]);
      res.json({ analysis });
    } catch (err: any) {
      console.error("Image analysis error:", err);
      let userMessage = "Image analysis failed. Please try again.";
      const raw = err.message || "";
      if (raw.includes("credit") || raw.includes("balance") || err.status === 400) {
        userMessage = "The AI service is temporarily unavailable due to billing limits. Please try again later.";
      } else if (err.status === 429 || raw.includes("rate")) {
        userMessage = "Too many requests. Please wait a moment and try again.";
      } else if (err.status === 401 || raw.includes("auth")) {
        userMessage = "Authentication error with the AI service. Please contact support.";
      }
      res.status(500).json({ error: userMessage });
    }
  });

  return httpServer;
}
