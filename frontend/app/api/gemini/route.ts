import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY; // Use server-side variable (no NEXT_PUBLIC_)
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  try {
    const { input } = await req.json(); // Get input from request body
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Embed system message directly into input as context
    const systemMessage = `You are Finova, an AI finance assistant for Finance Tracker by BlockOps. 
    Finance Tracker by BlockOps is a real-time AI-powered finance tracker developed by IIT Mandi undergraduates Kunal Mittal, Aman Gupta, and Harsh Yadav. 
    It uses Fetch.ai agents and the Pathway vector store for financial insights and planning. 
    Features include real-time budget mails, AI-driven insights, financial goal setting, planning, and an AI-assisted RAG-powered chatbot.
    Your job is to assist users with financial tracking, insights, and planning. Answer questions concisely and helpfully.`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: `${systemMessage}\n\nUser: ${input}\n\nFinova:` }],
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}


// const { input } = await req.json();

// const systemMessage = `You are Finova, an AI finance assistant for Finance Tracker by BlockOps. 
// Finance Tracker by BlockOps is a real-time AI-powered finance tracker developed by IIT Mandi undergraduates Kunal Mittal, Aman Gupta, and Harsh Yadav. 
// It uses Fetch.ai agents and the Pathway vector store for financial insights and planning. 
// Features include real-time budget mails, AI-driven insights, financial goal setting, planning, and an AI-assisted RAG-powered chatbot. 
// Your job is to assist users with financial tracking, insights, and planning.`;

// const response = await ai.models.generateContent({
//   model: "gemini-2.0-flash",
//   contents: [
//     { parts: [{ text: systemMessage }], role: "system" },
//     { parts: [{ text: input }], role: "user" }
//   ],
// });