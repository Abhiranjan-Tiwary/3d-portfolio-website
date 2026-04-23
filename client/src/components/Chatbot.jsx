import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 I'm Jarvis. Ask me anything about Abhiranjan." }
  ]);
  const [typing, setTyping] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [interviewMode, setInterviewMode] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // 🔊 STOP SPEECH
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  // 🔊 SPEAK
  const speak = (text) => {
    if (!voiceOn) return;
    stopSpeaking();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  // 🎙️ MIC SETUP
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "en-US";

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);

    rec.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);

      setTimeout(() => {
        sendMessage(text);
      }, 300);
    };

    recognitionRef.current = rec;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.abort();
      recognitionRef.current.start();
    } catch {}
  };

  // ⚡ TYPE EFFECT
  const typeMessage = async (text, baseMessages) => {
    let current = "";

    for (let i = 0; i < text.length; i++) {
      current += text[i];
      setMessages([...baseMessages, { role: "bot", text: current }]);
      await new Promise((res) => setTimeout(res, 5));
    }

    speak(text);
  };

  // 💬 SEND MESSAGE
  const sendMessage = async (voiceText = null) => {
    const finalText = voiceText || input;
    if (!finalText.trim()) return;

    stopSpeaking();

    const userMsg = { role: "user", text: finalText };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: finalText,
        mode: interviewMode ? "interview" : "normal"
      });

      let botReply = res?.data?.reply || "⚠️ AI not responding";

      setTyping(false);
      await typeMessage(botReply, newMessages);

    } catch {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
      
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "linear-gradient(135deg,#667eea,#764ba2)",
          color: "white",
          padding: "14px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)"
        }}
      >
        💬
      </button>

      {open && (
        <div
          style={{
            width: "370px",
            height: "500px",
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            color: "white"
          }}
        >
          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <b>🤖 Jarvis</b>

            <div style={{ display: "flex", gap: "6px" }}>
              
              {/* 💼 Interview Toggle */}
              <button
                onClick={() => setInterviewMode(!interviewMode)}
                style={{
                  background: interviewMode ? "#00c853" : "#444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "12px"
                }}
              >
                💼 {interviewMode ? "ON" : "OFF"}
              </button>

              {/* 🔊 Voice */}
              <button
                onClick={() => {
                  if (voiceOn) stopSpeaking();
                  setVoiceOn(!voiceOn);
                }}
                style={{
                  background: voiceOn ? "#2196f3" : "#555",
                  border: "none",
                  borderRadius: "6px",
                  color: "white"
                }}
              >
                {voiceOn ? "🔊" : "🔇"}
              </button>
            </div>
          </div>

          {/* CHAT */}
          <div style={{ flex: 1, overflowY: "auto", marginTop: "10px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px 14px",
                    margin: "6px",
                    borderRadius: "14px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg,#667eea,#764ba2)"
                        : "rgba(255,255,255,0.15)"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {typing && <div style={{ color: "#ccc" }}>⚡ Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div style={{
            display: "flex",
            gap: "6px",
            background: "rgba(255,255,255,0.1)",
            padding: "6px",
            borderRadius: "12px"
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or speak..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "white"
              }}
            />

            <button
              onClick={startListening}
              style={{
                background: listening ? "red" : "#444",
                border: "none",
                color: "white",
                borderRadius: "6px"
              }}
            >
              🎙️
            </button>

            <button
              onClick={() => sendMessage()}
              style={{
                background: "#667eea",
                border: "none",
                color: "white",
                borderRadius: "6px",
                padding: "6px 10px"
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;