require("dotenv").config();
const express = require("express");
const cors = require("cors");
const resumeData = require("./resumeData");
const knowledgeBase = require("./knowledgeBase.json");

const app = express();
app.use(cors());
app.use(express.json());

let chatMemory = [];
let interviewMode = false;

// 🔥 SKILLS DATA
const skillsData = {
  frontend: ["HTML", "CSS", "JavaScript", "React", "Redux"],
  backend: ["Node.js", "Express.js", "Flask"],
  database: ["MongoDB"],
  tools: ["Git", "GitHub", "VS Code", "Figma", "Vercel"],
  other: ["Artificial Intelligence"],
  languages: ["Java", "Python (Basic)"]
};

// 🔍 SMART MATCH (STRICT)
const smartMatch = (msg) => {
  const text = msg.toLowerCase();

  let matchedAnswers = [];

  for (let item of knowledgeBase) {
    for (let key of item.keywords) {
      if (text.includes(key)) {
        matchedAnswers.push(item.answer);
        break;
      }
    }
  }

  if (matchedAnswers.length > 0) {
    return [...new Set(matchedAnswers)].join("\n\n");
  }

  return null; // 🔥 IMPORTANT
};

// 🔥 GEMINI CALL
const callGemini = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (data.candidates?.length > 0) {
      return data.candidates[0].content.parts.map(p => p.text).join("");
    }

    return null;

  } catch (err) {
    console.log("🔥 Gemini Error:", err);
    return null;
  }
};

// 🧠 LOCAL AI (ONLY BASIC)
const localAI = (msg) => {
  const text = msg.toLowerCase();

  if (text.includes("hi") || text.includes("hello")) {
    return "Hey 👋 I'm Jarvis. Ask me anything!";
  }

  if (text.includes("who")) {
    return "I'm Jarvis, AI assistant of Abhiranjan.";
  }

  if (text.includes("skills")) {
    return `
Frontend: ${skillsData.frontend.join(", ")}
Backend: ${skillsData.backend.join(", ")}
Database: ${skillsData.database.join(", ")}
Tools: ${skillsData.tools.join(", ")}
Languages: ${skillsData.languages.join(", ")}
`;
  }

  if (text.includes("project")) {
    return "Built AI Chatbot, Inventory System, Event Management System.";
  }

  return null; // 🔥 NO DEFAULT TEXT
};

// 🚀 MAIN CHAT API
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message || "";
  const mode = req.body.mode || "normal";

  try {
    interviewMode = mode === "interview";

    console.log("USER:", userMessage);

    // 🧠 MEMORY
    chatMemory.push(`User: ${userMessage}`);
    if (chatMemory.length > 6) chatMemory.shift();

    // 🔍 STEP 1: SMART MATCH
    let reply = smartMatch(userMessage);
    console.log("SMART MATCH:", reply);

    // ✅ IF MATCH FOUND
    if (reply) {
      chatMemory.push(`AI: ${reply}`);
      return res.json({ reply });
    }

    // 🔥 STEP 2: GEMINI CALL (FORCE)
    console.log("🔥 CALLING GEMINI...");

    const prompt = `You are Jarvis AI.

Mode: ${interviewMode ? "Professional Interview Mode" : "Normal"}

Answer clearly, smartly and professionally.

RESUME:
${resumeData}

SKILLS:
${JSON.stringify(skillsData)}

MEMORY:
${chatMemory.join("\n")}

User: ${userMessage}
`;

    reply = await callGemini(prompt);

    // 🧠 STEP 3: FALLBACK
    if (!reply) {
      console.log("⚠️ Gemini failed → using fallback");
      reply =
        localAI(userMessage) ||
        "Sorry, I couldn't understand that right now.";
    }

    // 🧠 SAVE MEMORY
    chatMemory.push(`AI: ${reply}`);
    if (chatMemory.length > 6) chatMemory.shift();

    res.json({ reply });

  } catch (error) {
    console.log("Server error:", error);

    res.json({
      reply: "Server error. Try again later."
    });
  }
});

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("🚀 Jarvis AI Running (Hybrid AI Mode)");
});

// START SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});