import { z } from "zod";
import { User } from "../models/User.js";
import { GoldPurchase } from "../models/GoldPurchase.js";

const PurchaseInput = z.object({
	user: z.object({
		name: z.string().min(1),
		email: z.string().email(),
		phone: z.string().optional(),
	}),
	purchase: z.object({
		amountInINR: z.number().positive(),
	}).strict(),
});

function fakePricePerGramINR() {
	// In a real system fetch from provider; here a simple static or pseudo dynamic
	const base = 7000; // INR per gram baseline
	const variation = Math.floor(Math.random() * 200) - 100; // +/- 100
	return base + variation;
}

function calculateGrams(amountInINR, pricePerGramINR) {
	return Number((amountInINR / pricePerGramINR).toFixed(4));
}

function generateOrderId() {
	return `DG-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export async function handleDigitalGoldPurchase(req, res) {
	const parsed = PurchaseInput.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
	}

	const { user, purchase } = parsed.data;
	const pricePerGramINR = fakePricePerGramINR();
	const goldGrams = calculateGrams(purchase.amountInINR, pricePerGramINR);

	// Upsert user by email
	let dbUser = await User.findOneAndUpdate(
		{ email: user.email },
		{ $setOnInsert: { name: user.name, phone: user.phone } },
		{ new: true, upsert: true }
	);

	const orderId = generateOrderId();
	const record = await GoldPurchase.create({
		userId: dbUser._id,
		amountInINR: purchase.amountInINR,
		goldGrams,
		pricePerGramINR,
		orderId,
		status: "success",
	});

	return res.json({
		message: "Digital gold purchase successful",
		orderId: record.orderId,
		amountInINR: record.amountInINR,
		goldGrams: record.goldGrams,
		pricePerGramINR: record.pricePerGramINR,
		user: { id: dbUser._id, name: dbUser.name, email: dbUser.email },
	});
}
