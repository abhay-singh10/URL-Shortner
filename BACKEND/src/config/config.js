export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    //sameSite: "lax", // for local development
    sameSite: "none", // for deployment
    maxAge: 1000 * 60 * 60, // 1 HOUR
}