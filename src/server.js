import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectToDatabase } from "../config/db.js";

const PORT = process.env.PORT || 4000;

async function start() {
	await connectToDatabase();
	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});
}

start().catch((error) => {
	console.error("Fatal startup error:", error);
	process.exit(1);
});
