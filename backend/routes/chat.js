import express from "express";
import Thread from "../models/Thread.js";
import getCohereResponse from "../utils/getCohereResponse.js"; 


const router = express.Router();

// ✅ Create or skip duplicate thread
router.post("/test", async (req, res) => {
  try {
    const result = await Thread.updateOne(
      { threadId: "abc" },
      {
        $setOnInsert: {
          title: "Testing New Thread2",
          messages: [],
        },
      },
      { upsert: true }
    );

    res.status(200).json({ success: "Thread created or already exists", result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create or update thread" });
  }
});

// ✅ Get all threads (most recent first)
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// ✅ Get a specific thread's messages
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" }); // ✅ added return
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// ✅ Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" }); // ✅ added return
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// ✅ Main chat route
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" }); // ✅ added return
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      // Create new thread if it doesn't exist
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

   const assistantReply = await getCohereResponse(message);


    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
