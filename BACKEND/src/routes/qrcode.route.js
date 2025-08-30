import express from "express";
import { getQrForSlug } from "../controller/qrcode.controller.js";

const router = express.Router();
router.get("/:slug", getQrForSlug);

export default router;