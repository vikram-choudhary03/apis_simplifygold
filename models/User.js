import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String },
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
