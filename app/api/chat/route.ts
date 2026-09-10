import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authHelpers";

const GOAL_LABELS: Record<string, string> = {
  "500-1000": "$500–$1,000",
  "1000-3000": "$1,000–$3,000",
  "3000-5000": "$3,000–$5,000",
  "5000-10000": "$5,000–$10,000",
  "10000+": "$10,000+",
};

const TIME_LABELS: Record<string, string> = {
  "1-5": "1–5 hours",
  "5-15": "5–15 hours",
  "15-30": "15–30 hours",
  "30-40": "30–40 hours",
  "40+": "40+ hours",
};

const CAPITAL_LABELS: Record<string, string> = {
  "0": "$0",
  "1-100": "$1–$100",
  "100-500": "$100–$500",
  "500-2000": "$500–$2,000",
  "2000+": "$2,000+",
};

const label = (map: Record<string, string>, key?: string) => (key && map[key]) || key || "";

const encoder = new TextEncoder();
const sse = (obj: unknown) => encoder.encode(`data: ${JSON.stringify(obj)}\n\n`);

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

function fallbackText(
  name: string,
  goal: string,
  time: string,
  capital: string,
  skills: string,
  clientMessages: ChatMsg[]
) {
  if (clientMessages.length === 0) {
    return `Hey ${name}, great to see you.

Your goal of making ${goal} every month is completely doable — with ${time} a week and ${capital} to start, you've already got enough to begin.

${skills ? "Your strength in " + skills + " gives you a real head start." : "Your balance of skills and curiosity is a great starting point."}

Want to start with Phase 1: Foundation so we can nail down your offer?`;
  }
  return `Thanks — I'm catching up after a quick hiccup.

Can you rephrase that in a line or two? And while you're here, take a peek at the Plan tab — your whole roadmap is laid out there.`;
}

async function streamFallback(
  controller: ReadableStreamDefaultController<Uint8Array>,
  name: string,
  goal: string,
  time: string,
  capital: string,
  skills: string,
  clientMessages: ChatMsg[]
) {
  const text = fallbackText(name, goal, time, capital, skills, clientMessages);
  controller.enqueue(sse({ text, fallback: true }));
  controller.enqueue(sse({ done: true }));
}

export async function POST(request: Request) {
  try {
    let authUser;
    try {
      authUser = await getAuthenticatedUser();
    } catch {
      return unauthorizedResponse("Please log in to chat");
    }

    await connectDB();
    const user = await User.findById(authUser.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const clientMessages: ChatMsg[] = Array.isArray(body.messages)
      ? body.messages.filter(
          (m: { role?: string; content?: string }) =>
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.trim()
        )
      : [];

    if (!user.hasPaid && clientMessages.length > 0) {
      const firstName = (user.businessName || user.name || "friend").split(" ")[0];
      const text = [
        `Hey ${firstName}, you've had a taste of Valix — now it's time to level up.`,
        "",
        "Chatting with your AI coach is a paid feature. Upgrade to unlock unlimited coaching, market research, offer design, and your full daily plan.",
        "",
        "Your roadmap is locked until you upgrade — but it takes under a minute.",
      ].join("\n");

      const gateStream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(sse({ text, unpaid: true }));
          controller.enqueue(sse({ done: true, unpaid: true }));
          controller.close();
        },
      });

      return new Response(gateStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const sh = user.sideHustleProfile || {};
    const name = (user.businessName || user.name || "friend").split(" ")[0];
    const goal = label(GOAL_LABELS, sh.monthlyIncomeGoal) || "extra income";
    const time = label(TIME_LABELS, sh.weeklyTimeCommitment) || "whatever time you can spare";
    const capital = label(CAPITAL_LABELS, sh.startupCapital) || "limited starting cash";
    const skills = Array.isArray(sh.skills) && sh.skills.length ? sh.skills.join(", ") : "a fresh perspective";
    const languages = Array.isArray(sh.languages) && sh.languages.length ? sh.languages.join(", ") : "";
    const interests = Array.isArray(sh.interests) && sh.interests.length ? sh.interests.join(", ") : "";

    const system = [
      "You are Valix AI, a warm and highly actionable personal side-hustle coach.",
      "You help a single user build a profitable side hustle, one phase at a time.",
      "",
      "About the user:",
      `- Name: ${name}`,
      `- Goal: earn ${goal} per month`,
      `- Time available: ${time} per week`,
      `- Startup capital: ${capital}`,
      `- Skills: ${skills}`,
      languages ? `- Languages: ${languages}` : null,
      `- Interests: ${interests}`,
      "",
      "The roadmap your user follows: Foundation → Market Research → Offer Design → Brand & Presence → Client Acquisition → Grow & Scale → Daily Action Tasks.",
      "They are currently on Phase 1: Foundation.",
      "",
      "Style rules:",
      "- Be warm, encouraging but never cheesy. Match the user's energy.",
      "- Use markdown sparingly so it renders nicely: `**bold**`, short bullet lists with `-`, and number steps with `1.`. Avoid headings.",
      "- Keep replies under 140 words unless the user asks for details.",
      "- Use the user's name occasionally, especially at the start of a message.",
      "- Turn every answer into a next action or a question that moves them forward.",
      "- NEVER invent things about the user. If you need info, ask for it.",
      "",
      "If this is your very first message to the user (the conversation history is empty):",
      "- Greet them by name — something like: \"Hey ${name}, great to see you.\"",
      "- Remind them their goal of making ${goal} every month is completely doable, and connect it to their time (${time}) and capital (${capital}).",
      "- Point at their strengths from their profile (skills: ${skills}).",
      "- End by asking whether they'd like to start with Phase 1: Foundation.",
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    const apiMessages = [
      { role: "system" as const, content: system },
      ...clientMessages,
    ];

    const apiKey = process.env.OPENROUTER_API_KEY;

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        if (!apiKey) {
          await streamFallback(controller, name, goal, time, capital, skills, clientMessages);
          controller.close();
          return;
        }

        let aiRes: Response;
        try {
          aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
              "X-Title": "Valix",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini",
              messages: apiMessages,
              temperature: 0.7,
              max_tokens: 350,
              stream: true,
            }),
          });
        } catch (err) {
          console.error("OpenRouter fetch error:", err instanceof Error ? err.message : err);
          await streamFallback(controller, name, goal, time, capital, skills, clientMessages);
          controller.close();
          return;
        }

        if (!aiRes.ok || !aiRes.body) {
          const errText = await aiRes.text().catch(() => "");
          console.error("OpenRouter error:", aiRes.status, errText.slice(0, 500));
          await streamFallback(controller, name, goal, time, capital, skills, clientMessages);
          controller.close();
          return;
        }

        const reader = aiRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split("\n");
            buffer = events.pop() || "";

            for (const rawLine of events) {
              const line = rawLine.trim();
              if (!line.startsWith("data:")) continue;
              const payload = line.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;

              try {
                const json = JSON.parse(payload);
                const delta = json?.choices?.[0]?.delta?.content;
                if (typeof delta === "string" && delta.length > 0) {
                  controller.enqueue(sse({ text: delta }));
                }
              } catch {
                // ignore malformed chunks
              }
            }
          }
          controller.enqueue(sse({ done: true }));
        } catch (err) {
          console.error("Stream read error:", err instanceof Error ? err.message : err);
          await streamFallback(controller, name, goal, time, capital, skills, clientMessages);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    console.error("Chat error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}