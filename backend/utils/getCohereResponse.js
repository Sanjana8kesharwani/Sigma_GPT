import axios from "axios";

const getCohereResponse = async (message) => {
  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt: message,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.generations[0].text.trim();
  } catch (err) {
    console.error("🔥 Cohere Error:", err.response?.data || err.message);
    return "Sorry, something went wrong!";
  }
};

export default getCohereResponse;