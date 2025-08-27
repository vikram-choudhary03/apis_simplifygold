import express from "express";
import cors from "cors";
import chatRouter from "../routes/chat.js";
import purchaseRouter from "../routes/purchase.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/chat", chatRouter);
app.use("/api/purchase", purchaseRouter);

export default app;
