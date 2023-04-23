import express from "express";
import { generateUrl, fetchUrl } from "../controllers/urlController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { cache } from "../middleware/cache.js";

const router = express.Router();

router.post("/", authenticateToken, cache, generateUrl);
router.get("/:shortUrl", fetchUrl);

export default router;
