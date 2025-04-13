import express from "express";
import { chatWithGemini } from "../controllers/chatbotController";

const router = express.Router();

router.post("/", chatWithGemini);

export default router;