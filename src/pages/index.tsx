
import localFont from "next/font/local";
import React, { useState} from "react";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {

  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");


  const downloadVideo = async () => {
    if (!url) {
      setMessage("Please provide a valid URL");
      return;
    }

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success: ${data.downloadedFile}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error : any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className=" flex justify-center items-center">
      <div style={{ padding: "2rem", textAlign: "center" }} className=" bg-lime-300 p-10">
      <h1>Video Downloader</h1>
      <input
        type="text"
        placeholder="Enter video URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "60%", padding: "0.5rem" }}
      />
      <button
        onClick={downloadVideo}
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
      >
        Download
      </button>
      <p>{message}</p>
    </div>
     
    </div>
  );
}
