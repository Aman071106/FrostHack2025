// File: app/api/rag/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, user_query } = body;

    if (!url || !user_query || !Array.isArray(user_query)) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Forward the request to the local agent
    const response = await axios.post("http://localhost:8080/askAI", {
      url,
      user_query,
    });
    // console.log("Response from agent:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error forwarding request to agent:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: "Error communicating with agent",
          details: error.message,
          status: error.response?.status || 500,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Also handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
