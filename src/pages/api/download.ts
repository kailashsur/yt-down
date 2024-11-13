// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import path from "path";
import Error from "next/error";





export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  if(req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  
  const { url } = req.body || req.query ;

  if(!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid url" });
  }

  try {
    
    // yt-dlp path in root public/bin/yt-dlp
    const ytDlpPath = path.resolve("./public/bin/yt-dlp");
    const outputPath = path.resolve("./public/downloads");

    // Ensure the output directory exist
    const mkdirCommand = `mkdir -p ${outputPath}`;
    exec(mkdirCommand, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error });
      }
    });

    // yt-dlp command
    const command = `${ytDlpPath} -o ${outputPath}/'%(title)s.%(ext)s' ${url}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr });
      }


      // Extract the downloaded file name from stdout or infer it
      const downloadedFile = stdout.split("\n").find((line) => line.includes("Destination"));

      return res.status(200).json({ message: "Download complete", downloadedFile });
 
    });

  } catch (error : any) {
    console.error('error at download route :- ',error);
    return res.status(500).json({ error: "internal error" });
  }


}
