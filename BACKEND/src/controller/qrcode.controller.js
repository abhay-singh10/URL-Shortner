import wrapAsync from "../utils/tryCatchWrapper.js";
import { NotFoundError } from "../utils/errorHandler.js";
import { existsShortUrl } from "../dao/short_url.js";
import { buildShortLink, parseQrQuery } from "../utils/helper.js";
import { generateQrImage } from "../services/qrcode.service.js";

export const getQrForSlug = wrapAsync(async (req, res) => {
  const { slug } = req.params;

  // 404 if slug doesn't exist
  const exists = await existsShortUrl(slug);
  if (!exists) throw new NotFoundError("Short URL not found");

  // Encode the canonical short URL
  const urlToEncode = buildShortLink(req, slug);
  const opts = parseQrQuery(req); // returns { size, margin, ec, dark, light }

  // Generate PNG buffer
  const pngBuffer = await generateQrImage(urlToEncode, opts);

  // Strong caching; send PNG
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  res.type("image/png");

  //Force download when req.query.dl === "1"
  if (req.query.dl === "1") {
    res.set("Content-Disposition", `attachment; filename="qr-${slug}.png"`);
  }

  return res.send(pngBuffer);
});