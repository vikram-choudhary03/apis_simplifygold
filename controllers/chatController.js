import { z } from "zod";
import { askLLM, detectGoldIntent, ruleBasedGoldAnswer, nudgeToDigitalGold } from "../services/llm.js";
import { getGeminiResponse } from "../services/gemini.js"; // Import Gemini AI service

const ChatInput = z.object({
	message: z.string().min(1, "message is required"),
	userContext: z.object({
		name: z.string().optional(),
		email: z.string().email().optional(),
		phone: z.string().optional(),
	}).optional(),
});

export async function handleChat(req, res) {
	const parse = ChatInput.safeParse(req.body);
	if (!parse.success) {
		return res.status(400).json({ error: "Invalid request", details: parse.error.flatten() });
	}
	const { message, userContext } = parse.data;

	const isGold = detectGoldIntent(message);
	let answer = null;
	
	if (isGold) {
		answer = await askLLM(message);

		// Fallback to Gemini AI if OpenAI fails
		if (!answer && process.env.GEMINI_API_KEY) {
			try {
				answer = await getGeminiResponse(message);
			} catch (error) {
				console.error("Gemini AI fallback failed:", error.message);
			}
		}
		
		if (!answer) {
			answer = ruleBasedGoldAnswer(message);
		}

		const nudge = nudgeToDigitalGold();
		return res.json({
			intent: "gold_investment",
			answer,
			nudge,
			followUp: {
				cta: "proceed_to_digital_gold_purchase",
				endpoint: "/api/purchase/digital-gold",
				payloadExample: {
					user: {
						name: userContext?.name || "Demo User",
						email: userContext?.email || "demo@example.com",
						phone: userContext?.phone || "9999999999",
					},
					purchase: { amountInINR: 1000 }
				}
			}
		});
	}

	// Non-gold: try LLM once, else echo guidance
	answer = (await askLLM(message)) || null;

	// Fallback to Gemini AI for non-gold queries
	if (!answer && process.env.GEMINI_API_KEY) {
		try {
			answer = await getGeminiResponse(message);
		} catch (error) {
			console.error("Gemini AI fallback failed:", error.message);
		}
	}

	answer = answer || "I can help with gold investments. Ask me about gold price, how to buy, or SGBs.";
	return res.json({ intent: "generic", answer });
}
