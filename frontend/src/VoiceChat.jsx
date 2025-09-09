import React, { useState } from "react";

const VoiceSearch = ({ prompt, setPrompt }) => {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice recognition!");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript); // 🔹 Directly set text in search box
    };

    recognition.start();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type or use voice..."
        style={{ flex: 1, padding: "0.5rem" }}
      />
      <button
        onClick={startListening}
        style={{
          padding: "0.5rem 1rem",
          cursor: "pointer",
          background: listening ? "#f00" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {listening ? "Listening..." : "🎤"}
      </button>
    </div>
  );
};

export default VoiceSearch;
