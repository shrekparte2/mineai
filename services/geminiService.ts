
import { GoogleGenAI, Type } from "@google/genai";
import { AddonResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAddonData = async (prompt: string): Promise<AddonResult> => {
  const textResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an elite Minecraft Bedrock Edition Add-on Architect.
    
    TASK: Generate a complete, working .mcaddon structure for: "${prompt}".
    THEME: "Anything is possible" - be wildly creative, complex, and professional.
    
    REQUIREMENTS:
    1. Structure must include both Behavior Pack (BP) and Resource Pack (RP) folders.
    2. Generate unique UUIDs for manifest.json files.
    3. Include entities, items, blocks, functions, or loot tables as necessary.
    4. All JSON must be valid and follow Minecraft Bedrock schemas.
    5. Be thorough: if they ask for a dragon, include entity JSON, client_entity JSON, and animation controllers.

    Return as JSON object with 'name', 'description', and 'files' (array of {path, content}).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                path: { type: Type.STRING, description: "Path starting with BP/ or RP/" },
                content: { type: Type.STRING, description: "Full JSON string or text content" }
              },
              required: ["path", "content"]
            }
          }
        },
        required: ["name", "description", "files"]
      }
    }
  });

  const addonData = JSON.parse(textResponse.text);

  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Minecraft high-fidelity cinematic game screenshot of: ${prompt}. Professional RTX raytracing, photorealistic Minecraft style, 4k resolution, showcase the mod features in a breathtaking landscape.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  let imageUrl = "https://picsum.photos/800/450";
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  return {
    ...addonData,
    imageUrl
  };
};
