import mongoose from "mongoose";

export async function connectToDatabase() {
	const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/simplifymoney";
	mongoose.set("strictQuery", true);
	await mongoose.connect(mongoUri, {
		serverSelectionTimeoutMS: 5000,
	});
	console.log("Connected to MongoDB");
}
