import { getShortUrl } from "../dao/short_url.js"
import { createShortUrlWithoutUser, createShortUrlWithUser } from "../services/short_url.service.js"
import wrapAsync from "../utils/tryCatchWrapper.js"

export const createShortUrl = wrapAsync(async (req,res)=>{
    const data = req.body
    let shortUrl, qrUrl    
    if(req.user){
        shortUrl = await createShortUrlWithUser(data.url,req.user._id,data.slug)
    }else{  
        shortUrl = await createShortUrlWithoutUser(data.url)
    }
    const base = process.env.APP_URL || "http://localhost:3000/";
    qrUrl = `${req.protocol}://${req.get("host")}/api/qr/${shortUrl}?size=256`;
    res.status(200).json({
        shortUrl : base + shortUrl,
        qrUrl
    })
})


export const redirectFromShortUrl = wrapAsync(async (req,res)=>{
    const {id} = req.params
    const url = await getShortUrl(id)
    if(!url) throw new Error("Short URL not found")
    res.redirect(url.full_url)
})

export const createCustomShortUrl = wrapAsync(async (req,res)=>{
    const {url,customUrl} = req.body
    const shortUrl = await createShortUrlWithoutUser(url,customUrl)
    const base = process.env.APP_URL || "http://localhost:3000/";
    const qrUrl = `${req.protocol}://${req.get("host")}/api/qr/${shortUrl}?size=256`;
    res.status(200).json({
        shortUrl : base + shortUrl,
        qrUrl
    })
})