import axios from "axios";

const getCohereResponse = async (message) => {
  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        model: "command-r-plus", 
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.text;
  } catch (err) {
    console.error(" Cohere Error:", err.response?.data || err.message);
    return "Sorry, something went wrong!";
  }
};

export default getCohereResponse;