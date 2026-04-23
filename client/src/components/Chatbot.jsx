import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const sendMessageRef = useRef(null);
  const voiceSendTimeoutRef = useRef(null);
  const isSendingRef = useRef(false);
  const messagesRef = useRef(messages);
  const inputRef = useRef(input);
  const interviewModeRef = useRef(interviewMode);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    interviewModeRef.current = interviewMode;
  }, [interviewMode]);

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text) => {
      if (!voiceOn || !("speechSynthesis" in window)) {
        return;
      }

      stopSpeaking();
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      window.speechSynthesis.speak(speech);
    },
    [stopSpeaking, voiceOn]
  );

  const typeMessage = useCallback(
    async (text, baseMessages) => {
      let current = "";

      for (let i = 0; i < text.length; i += 1) {
        current += text[i];
        const typedMessages = [...baseMessages, { role: "bot", text: current }];
        messagesRef.current = typedMessages;
        setMessages(typedMessages);
        await new Promise((resolve) => setTimeout(resolve, 5));
      }

      speak(text);
    },
    [speak]
  );

  const sendMessage = useCallback(
    async (voiceText = null) => {
      const finalText = (voiceText ?? inputRef.current).trim();

      if (!finalText || isSendingRef.current) {
        return;
      }

      isSendingRef.current = true;
      stopSpeaking();

      const userMsg = { role: "user", text: finalText };
      const newMessages = [...messagesRef.current, userMsg];

      messagesRef.current = newMessages;
      inputRef.current = "";
      setMessages(newMessages);
      setInput("");
      setTyping(true);

      try {
        const res = await axios.post("http://localhost:5000/api/chat", {
          message: finalText,
          mode: interviewModeRef.current ? "interview" : "normal"
        });

        const botReply =
          res?.data?.reply ||
          "I'm having trouble answering that right now. Please try again in a moment.";

        setTyping(false);
        await typeMessage(botReply, newMessages);
      } catch {
        const fallbackReply =
          "I'm having trouble reaching the assistant right now. Please try again in a moment or use the contact form.";

        setTyping(false);
        await typeMessage(fallbackReply, newMessages);
      } finally {
        isSendingRef.current = false;
      }
    },
    [stopSpeaking, typeMessage]
  );

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return undefined;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (event) => {
      const text = event.results[0][0].transcript;

      inputRef.current = text;
      setInput(text);

      if (voiceSendTimeoutRef.current) {
        window.clearTimeout(voiceSendTimeoutRef.current);
      }

      voiceSendTimeoutRef.current = window.setTimeout(() => {
        sendMessageRef.current?.(text);
      }, 300);
    };

    recognitionRef.current = rec;

    return () => {
      if (voiceSendTimeoutRef.current) {
        window.clearTimeout(voiceSendTimeoutRef.current);
      }

      rec.onstart = null;
      rec.onend = null;
      rec.onresult = null;
      rec.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const startListening = () => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.abort();
      recognitionRef.current.start();
    } catch {
      // Ignore browser speech-recognition start conflicts.
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <b>🤖 Jarvis</b>

            <div style={{ display: "flex", gap: "6px" }}>
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

              <button
                onClick={() => {
                  if (voiceOn) {
                    stopSpeaking();
                  }
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

          <div style={{ flex: 1, overflowY: "auto", marginTop: "10px" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
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

          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "rgba(255,255,255,0.1)",
              padding: "6px",
              borderRadius: "12px"
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
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
