import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import { anthropic } from "@ai-sdk/anthropic"

// Allow streaming responses up to 60 seconds for complex reasoning
export const maxDuration = 60

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

// Different models for different purposes
const MODELS = {
  groq: {
    fast: "llama-3.1-8b-instant", // Quick responses, casual chat
    reasoning: "llama-3.3-70b-versatile", // Complex analysis, problem-solving
    creative: "qwen/qwen3-32b", // Creative tasks, brainstorming  
  },
  gemini: {
    default: "gemini-2.0-flash",
  },
  openai: {
    default: "gpt-4o",
    turbo: "gpt-4-turbo",
    fast: "gpt-3.5-turbo",
  },
  claude: {
    default: "claude-3-5-sonnet-20241022",
    sonnet: "claude-3-sonnet-20240229",
    haiku: "claude-3-haiku-20240307",
  },
}

const SYSTEM_PROMPT = `
You are a ByteCode helpful GenZ AI assistant. Be concise, friendly, and practical.When generate response use Related emoji for better user experience.

Company Name: ByteCode Limited  
Website: https://bytecodeltd.com/

Overview:
ByteCode Limited is a dynamic software development company that delivers cutting-edge custom software solutions. With over a decade of experience, ByteCode builds powerful web and mobile applications that help organizations gain a competitive edge in the digital world.

Mission:
Listening to you, and answering with cutting-edge software engineering solutions.

Core Values:
- Quality over everything: We never compromise on quality.
- Innovation in every Byte: We develop with unique and modern perspectives.
- Timely and accurate delivery: Sharp execution with proactive communication.
- Long-term client relationships: We always provide after-sale support and technical help.
- Friendly, efficient team environment: Collaborative, skilled, and highly motivated.

What Makes ByteCode Different:
- Flawless and proactive communication with clients.
- Cost-effective, world-class technology.
- Professional after-sales support.
- Friendly and productive work culture.
- Dedicated QA and testing for every product.
- Top-tier technical talent for high-performing solutions.

Services We Provide:
1. **Software Development**  
   Flexible and scalable software solutions tailored to specific customer needs, built using a well-defined process to manage changes, reduce bugs, and improve quality.

2. **Web Application Development**  
   Full-stack development using ASP.NET, C#.NET, React.JS, Angular, Node.js, Python, and more. Our web apps are efficient, custom-fit to business goals, and delivered on time and within budget.

3. **Mobile Application Development**  
   Powerful mobile solutions using Android, iOS, React Native. Key features: user-friendly dashboards, admin control, APIs, SDKs for professional-grade functionality.

4. **Quality Assurance**  
   Every phase includes strict quality checks using advanced tools. We prioritize perfection by detecting and fixing bugs before final delivery.

Technologies We Use:
- Backend: ASP.NET, C#.NET, Node.js, Python
- Frontend: React.JS, Angular
- Mobile: Android (Native), iOS (Native), React Native

Development Process:
1. Requirement Analysis
2. Prototype Design
3. Client Feedback & Revisions
4. Final Development
5. QA Testing
6. Deployment & Support

Team ByteCode:
- A friendly, skilled, and experienced team
- Works collaboratively with clients
- Prioritizes your satisfaction — "We work until you're happy."

Why Choose ByteCode:
- Innovation: Unique ideas for the best user experiences
- Standard: Eliminating imperfections for top-quality output
- Teamwork: Clients and developers work hand-in-hand
- Service: Strong, ongoing client relationships

Contact Information:
📞 Phone: +88 0222 447 0613, +88 01936 444 555  
📧 Email: info@bytecodeltd.com  
📍 Address: House # 19 (1st Floor), Road # 20, Sector # 13, Uttara, Dhaka 1230

Company Pages:
- Home
- About
- Services
- Contact

Newsletter:
Stay updated with the latest tech tips and company news by subscribing via email.

Slogan:
"Innovation in every Byte."

You must always reflect ByteCode's values, mission, and tone: professional, helpful, modern, and easy to understand.
`;

export async function POST(req: Request) {
  try {
    console.log("=== Chat API Request Started ===")

    // Parse request body
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return Response.json({ error: "Invalid request format: Request body must be valid JSON" }, { status: 400 })
    }

    const { messages, mode = "general", provider = "groq", apiKey } = body
    console.log("📝 Request details:", {
      messagesCount: messages?.length || 0,
      mode,
      provider,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasGeminiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      hasUserApiKey: !!apiKey,
      firstMessage: messages?.[0]?.content?.substring(0, 50) + "...",
    })

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("Invalid messages:", { messages, type: typeof messages })
      return Response.json({ error: "Invalid messages format: Messages must be a non-empty array" }, { status: 400 })
    }

    // Handle Gemini requests
    if (provider === "gemini") {
      const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
      if (!geminiApiKey) {
        console.error("GOOGLE_GENERATIVE_AI_API_KEY not configured")
        return Response.json(
          { error: "API configuration error: GOOGLE_GENERATIVE_AI_API_KEY is not configured" },
          { status: 500 },
        )
      }

      try {
        console.log("Using Gemini model:", MODELS.gemini.default)

        const result = await streamText({
          model: google(MODELS.gemini.default),
          system: SYSTEM_PROMPT,
          messages,
          temperature: mode === "creative" ? 0.8 : mode === "bff" ? 0.9 : 0.7,
          maxTokens: 1000,
        })

        console.log("Gemini request successful, streaming response")
        return result.toDataStreamResponse()
      } catch (geminiError) {
        console.error("Gemini API Error:", geminiError)
        return Response.json(
          {
            error: `Gemini API Error: ${geminiError instanceof Error ? geminiError.message : "Unknown error"}`,
          },
          { status: 500 },
        )
      }
    }

    // Handle OpenAI requests
    if (provider === "openai") {
      const openaiApiKey = apiKey
      if (!openaiApiKey) {
        console.error("OpenAI API key not provided")
        return Response.json({ error: "API configuration error: OpenAI API key is required" }, { status: 500 })
      }

      try {
        const openai = createOpenAI({
          apiKey: openaiApiKey,
        })

        console.log("Using OpenAI model:", MODELS.openai.default)

        const result = await streamText({
          model: openai(MODELS.openai.default),
          system: SYSTEM_PROMPT,
          messages,
          temperature: mode === "creative" ? 0.8 : mode === "bff" ? 0.9 : 0.7,
          maxTokens: 1000,
        })

        console.log("OpenAI request successful, streaming response")
        return result.toDataStreamResponse()
      } catch (openaiError) {
        console.error("OpenAI API Error:", openaiError)
        return Response.json(
          {
            error: `OpenAI API Error: ${openaiError instanceof Error ? openaiError.message : "Unknown error"}`,
          },
          { status: 500 },
        )
      }
    }

    // Handle Claude requests
    if (provider === "claude") {
      const claudeApiKey = apiKey
      if (!claudeApiKey) {
        console.error("Claude API key not provided")
        return Response.json({ error: "API configuration error: Claude API key is required" }, { status: 500 })
      }

      try {
        console.log("Using Claude model:", MODELS.claude.default)

        const result = await streamText({
          model: anthropic(MODELS.claude.default),
          system: SYSTEM_PROMPT,
          messages,
          temperature: mode === "creative" ? 0.8 : mode === "bff" ? 0.9 : 0.7,
          maxTokens: 1000,
        })

        console.log("Claude request successful, streaming response")
        return result.toDataStreamResponse()
      } catch (claudeError) {
        console.error("Claude API Error:", claudeError)
        return Response.json(
          {
            error: `Claude API Error: ${claudeError instanceof Error ? claudeError.message : "Unknown error"}`,
          },
          { status: 500 },
        )
      }
    }

    // Handle Groq requests (default)
    if (provider === "groq") {
      if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY environment variable is not set")
        return Response.json({ error: "API configuration error: GROQ_API_KEY is not configured" }, { status: 500 })
      }

      try {
        // Determine which model to use based on the conversation context
        let modelType = "fast"
        const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""

        // Use reasoning model for complex tasks
        if (
          lastMessage.includes("analyze") ||
          lastMessage.includes("compare") ||
          lastMessage.includes("plan") ||
          lastMessage.includes("strategy") ||
          lastMessage.includes("decision") ||
          lastMessage.includes("problem")
        ) {
          modelType = "reasoning"
        }

        // Use creative model for creative tasks
        if (
          lastMessage.includes("creative") ||
          lastMessage.includes("brainstorm") ||
          lastMessage.includes("idea") ||
          lastMessage.includes("write") ||
          lastMessage.includes("design") ||
          lastMessage.includes("story")
        ) {
          modelType = "creative"
        }

        const selectedModel = MODELS.groq[modelType as keyof typeof MODELS.groq]

        console.log("AI Configuration:", {
          mode,
          modelType,
          selectedModel,
          systemPromptLength: SYSTEM_PROMPT.length,
        })

        // Create the AI request
        const result = await streamText({
          model: groq(selectedModel),
          system: SYSTEM_PROMPT,
          messages,
          temperature: modelType === "creative" ? 0.8 : mode === "bff" ? 0.9 : 0.7,
          maxTokens: 1000,
        })

        console.log("Groq request successful, streaming response")
        return result.toDataStreamResponse()
      } catch (groqError) {
        console.error("Groq API Error:", groqError)
        return Response.json(
          {
            error: `Groq API Error: ${groqError instanceof Error ? groqError.message : "Unknown error"}`,
          },
          { status: 500 },
        )
      }
    }

    // If we get here, the provider is not supported
    return Response.json({ error: `Unsupported provider: ${provider}` }, { status: 400 })
  } catch (error) {
    console.error("Chat API Error:", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined,
    })

    return Response.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
