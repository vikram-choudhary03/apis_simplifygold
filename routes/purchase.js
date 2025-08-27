import { Router } from "express";
import { handleDigitalGoldPurchase } from "../controllers/purchaseController.js";

const router = Router();
router.post("/digital-gold", handleDigitalGoldPurchase);
export default router;
