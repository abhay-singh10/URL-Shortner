import { nanoid } from "nanoid";
import jsonwebtoken from "jsonwebtoken"

export const generateNanoId = (length) =>{
    return nanoid(length);
}

export const signToken = (payload) =>{
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"})
}

export const verifyToken = (token) =>{

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
    console.log(decoded.id)
    return decoded.id
}

// Build canonical short link (not the QR endpoint)
export const buildShortLink = (req, slug) => {
    const clean = String(slug).replace(/^\//, "");
    const host = `${req.protocol}://${req.get("host")}`;
    return `${host}/${clean}`; // or `${host}/r/${clean}` if you adopt a redirect prefix
};

// Parse QR options (PNG-only endpoint)
export const parseQrQuery = (req) => {
    const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
    const size = clamp(parseInt(req.query.size || "256", 10) || 256, 128, 1024);
    const margin = clamp(parseInt(req.query.margin || "4", 10) || 4, 0, 8);
    const ec = String(req.query.ec || "M").toUpperCase(); // L|M|Q|H
    const dark = req.query.dark ? String(req.query.dark) : "#000000";
    const light = req.query.light ? String(req.query.light) : "#FFFFFF";
    return { size, margin, ec, dark, light };
};