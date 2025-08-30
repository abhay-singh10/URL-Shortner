import QRCode from "qrcode";

/**
 * Generate a PNG QR image for the given text.
 * @param {string} text
 * @param {{ size?: number, margin?: number, ec?: 'L'|'M'|'Q'|'H', dark?: string, light?: string }} opts
 * @returns {Promise<Buffer>}
 */
export const generateQrImage = async (
  text,
  { size = 256, margin = 4, ec = "M", dark = "#000000", light = "#FFFFFF" } = {}
) => {
  return QRCode.toBuffer(text, {
    errorCorrectionLevel: ec,
    type: "png",
    width: size,
    margin,
    color: { dark, light },
  });
};