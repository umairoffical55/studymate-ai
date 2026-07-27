import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1. Parse request body
    const body = await request.json().catch(() => ({}));
    const { topic } = body;

    // 2. Validate topic input
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { error: "Please provide a topic or question for the tutor." },
        { status: 400 }
      );
    }

    // 3. Validate Groq API Key configuration
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("Missing GROQ_API_KEY environment variable.");
      return NextResponse.json(
        { 
          error: "Groq API Key is not configured. Please add GROQ_API_KEY to your environment variables (e.g. .env.local)." 
        },
        { status: 500 }
      );
    }

    // 4. Build system prompt
    const systemPrompt = 
      "You are StudyMate, a patient, encouraging tutor for students. When given a topic or question, respond in this exact structure: " +
      "1. SIMPLE EXPLANATION: Explain the concept in 3-5 short sentences, plain language, no jargon, as if teaching a beginner. Use a real-world analogy if it helps. " +
      "2. KEY POINTS: 3 short bullet points of the most important facts to remember. " +
      "3. PRACTICE QUESTIONS: Write exactly 3 practice questions to test understanding of this topic, increasing in difficulty. Do not answer them. " +
      "Keep the whole response under 250 words. Be warm and motivating, never condescending.";

    // 5. Call Groq API via fetch
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please explain this topic/question: "${topic.trim()}"` }
        ],
        max_tokens: 600,
        temperature: 0.5,
      }),
    });

    // 6. Handle response and check errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Groq API responded with status ${response.status}`
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("No response content received from the Groq AI model.");
    }

    return NextResponse.json({ response: text }, { status: 200 });

  } catch (error) {
    console.error("Error in AI Tutor API Route (Groq):", error);
    return NextResponse.json(
      { 
        error: error.message || "An unexpected error occurred while communicating with the AI tutor. Please try again later." 
      },
      { status: 500 }
    );
  }
}
