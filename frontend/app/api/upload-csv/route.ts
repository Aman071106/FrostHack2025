import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = { api: { bodyParser: false } }; // Required for FormData

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure the upload directory exists
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

export async function POST(req: Request) {
  try {
    const form = new formidable.IncomingForm({ uploadDir: UPLOAD_DIR, keepExtensions: true });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file?.[0];
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    return NextResponse.json({
      message: "CSV uploaded successfully",
      fileUrl: `/uploads/${file.newFilename}`,
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json({ error: "Upload failed", details: error.toString() }, { status: 500 });
  }
}
