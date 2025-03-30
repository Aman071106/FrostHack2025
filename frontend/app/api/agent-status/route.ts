// File: app/api/agent-status/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get("http://localhost:8080/", {
      timeout: 5000, // 5 second timeout
    });

    return NextResponse.json({
      status: "online",
      statusCode: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "offline",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 200, // We still return 200 to client, just with offline status
      }
    );
  }
}
