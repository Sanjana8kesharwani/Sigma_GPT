import axios from "axios";

const getAIResponse = async (message) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // ✅ working model
        messages: [
          { role: "user", content: message }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("🔥 Groq Error:", err.response?.data || err.message);
    return "Sorry, something went wrong!";
  }
};

export default getAIResponse;