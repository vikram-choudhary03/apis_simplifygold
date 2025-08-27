import mongoose from "mongoose";

const goldPurchaseSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		amountInINR: { type: Number, required: true },
		goldGrams: { type: Number, required: true },
		pricePerGramINR: { type: Number, required: true },
		orderId: { type: String, required: true, unique: true },
		status: { type: String, enum: ["success", "failed"], default: "success" },
	},
	{ timestamps: true }
);

export const GoldPurchase = mongoose.model("GoldPurchase", goldPurchaseSchema);
