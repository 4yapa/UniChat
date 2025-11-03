import express from "express";
import { getMessages, getUsersForSidebar, sendMessage } from "../control/message.js";
import { protectRoute } from "../lib/protect-route.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;