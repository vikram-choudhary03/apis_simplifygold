import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();


const ai = new GoogleGenAI({ });

export async function getGeminiResponse(prompt) {
   
	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash", // Use the appropriate model
			contents: prompt,
            config: {
                thinkingConfig: {
                  thinkingBudget: 0, // Disables thinking
                },
              }
		});
        
		return response.text; // Adjust based on the actual response structure
	} catch (error) {
		console.error("Error calling Gemini API:", error.message);
		throw new Error("Failed to get a response from Gemini API");
	}
}