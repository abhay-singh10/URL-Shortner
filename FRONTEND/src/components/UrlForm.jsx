import React, { useState } from 'react'
import { createShortUrl } from '../api/shortUrl.api'
import { useSelector } from 'react-redux'
import { queryClient } from '../main'

const UrlForm = () => {

  const [url, setUrl] = useState("https://www.google.com")
  const [shortUrl, setShortUrl] = useState()
  const [copied, setCopied] = useState(false)
  const [qrUrl, setQrUrl] = useState(null)
  const [error, setError] = useState(null)
  const [customSlug, setCustomSlug] = useState("")
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleSubmit = async () => {
    try {
      const data = await createShortUrl(url, customSlug)
      setShortUrl(data.shortUrl)
      setQrUrl(data.qrUrl)
      queryClient.invalidateQueries({ queryKey: ['userUrls'] })
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  // Download QR same way as in UserUrl (Blob + programmatic <a>)
  const handleDownloadQR = async () => {
    if (!qrUrl) return
    try {
      const res = await fetch(qrUrl, { credentials: "omit" })
      if (!res.ok) throw new Error(`Failed to fetch QR (${res.status})`)
      const blob = await res.blob() // image/png
      const obj = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = obj
      // derive a nice filename from qrUrl (slug at end of path)
      let filename = "qr.png"
      try {
        const u = new URL(qrUrl)
        const slug = u.pathname.split("/").pop() || "link"
        filename = `qr-${slug}.png`
      } catch { }
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(obj)
    } catch (e) {
      console.error(e)
      alert("Could not download QR. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Enter your URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onInput={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleSubmit}
        type="button"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        Generate
      </button>
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {isAuthenticated && (
        <div className="mt-4">
          <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700 mb-1">
            Custom URL (optional)
          </label>
          <input
            type="text"
            id="customSlug"
            value={customSlug}
            onChange={(event) => setCustomSlug(event.target.value)}
            placeholder="Enter custom slug"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      {shortUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Your shortened URL:</h2>
          <div className="flex items-center">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="flex-1 p-2 border border-gray-300 rounded-l-md bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-r-md cursor-pointer transition-colors duration-200 ${copied
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {qrUrl && (
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">QR code:</h3>
          <img src={qrUrl} alt="QR code" width={256} height={256} />
          <div className="mt-2">
            <button
              onClick={handleDownloadQR}
              className="text-blue-600 underline hover:text-blue-700 cursor-pointer"
            >
              Download QR
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UrlForm