import "dotenv/config";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const getCohereResponse = async (message) => {
  try {
    const response = await cohere.generate({
      model: "command",
      prompt: message,
      maxTokens: 100,
      temperature: 0.9,
    });

    return response.generations[0].text.trim(); // AI reply
  } catch (err) {
    console.error("Cohere API Error:", err);
    return "Sorry, something went wrong!";
  }
};

export default getCohereResponse;
