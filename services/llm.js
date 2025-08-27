import OpenAI from "openai";

function buildOpenAIClient() {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) return null;
	return new OpenAI({ apiKey });
}

const openai = buildOpenAIClient();

export async function askLLM(prompt) {
	if (!openai) return null;
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{ role: "system", content: "You are KuberAI-like assistant for gold investments in Simplify Money. Keep answers concise and factual." },
				{ role: "user", content: prompt }
			]
		});
		return response.choices?.[0]?.message?.content?.trim() || null;
	} catch (_e) {
		return null;
	}
}

export function detectGoldIntent(text) {
	const hay = (text || "").toLowerCase();
	const goldKeywords = [
		"gold", "digital gold", "24k", "24 karat", "sovereign gold bond", "sgb",
		"gold investment", "gold price", "gold rate", "buy gold", "sell gold", "redeem gold"
	];
	return goldKeywords.some((k) => hay.includes(k));
}

export function ruleBasedGoldAnswer(text) {
	const hay = (text || "").toLowerCase();
	if (hay.includes("price") || hay.includes("rate")) {
		return "Gold prices fluctuate daily based on global markets. Consider cost averaging and long-term holding for diversification.";
	}
	if (hay.includes("how") && (hay.includes("invest") || hay.includes("buy"))) {
		return "You can invest in gold via Digital Gold for liquidity, SGBs for interest + tax benefits, or ETFs for market exposure.";
	}
	return "Gold can help diversify your portfolio and hedge inflation. Match allocations to your risk profile (typically 5-10%).";
}

export function nudgeToDigitalGold() {
	return "Want me to proceed with a digital gold purchase for you?";
}
