import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";

const UserUrl = () => {
  const { data: urls, isLoading, isError, error } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  });

  const [copiedId, setCopiedId] = useState(null);
  const [previewId, setPreviewId] = useState(null);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reliable cross-origin PNG download using Blob
  const handleDownloadQR = async (slug, size = 256) => {
    try {
      const BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
      const qrUrl = `${BASE}/api/qr/${encodeURIComponent(slug)}?size=${size}`;
      const res = await fetch(qrUrl, { credentials: "omit" });
      if (!res.ok) throw new Error(`Failed to fetch QR (${res.status})`);
      const blob = await res.blob(); // image/png
      const obj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = obj;
      a.download = `qr-${slug}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(obj);
    } catch (e) {
      console.error(e);
      alert("Could not download QR. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Error loading your URLs: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!urls?.urls || urls.urls.length === 0) {
    return (
      <div className="text-center text-gray-500 my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <svg
          className="w-12 h-12 mx-auto text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="text-lg font-medium">No URLs found</p>
        <p className="mt-1">You haven't created any shortened URLs yet.</p>
      </div>
    );
  }

  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

  return (
    <div className="bg-white rounded-lg mt-5 shadow-md overflow-hidden">
      <div className="overflow-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {urls?.urls?.slice().reverse().map((item) => {
              const shortHref = `${BASE_URL}/${item.short_url}`;
              const shortDisplay = `${BASE_URL.replace(/^https?:\/\//, "")}/${item.short_url}`;
              const qrPreviewSrc = `${BASE_URL}/api/qr/${item.short_url}?size=128`;

              return (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">{item.full_url}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <a
                        href={shortHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 hover:underline break-all"
                      >
                        {shortDisplay}
                      </a>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-1.5 inline-flex text-[10px] leading-4 font-medium rounded-full bg-blue-100 text-blue-800">
                      {item.clicks} {item.clicks === 1 ? "click" : "clicks"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleCopy(shortHref, item._id)}
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm ${copiedId === item._id
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                    >
                      {copiedId === item._id ? "Copied!" : "Copy URL"}
                    </button>

                    <button
                      onClick={() => handleDownloadQR(item.short_url, 256)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border shadow-sm bg-gray-100 hover:bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Download QR
                    </button>

                    <button
                      onClick={() => setPreviewId((prev) => (prev === item._id ? null : item._id))}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border shadow-sm bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {previewId === item._id ? "Hide QR" : "Preview QR"}
                    </button>

                    {previewId === item._id && (
                      <div className="mt-2 p-2 border rounded bg-white shadow-sm inline-block align-top">
                        <img src={qrPreviewSrc} alt="QR preview" width={128} height={128} />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserUrl;