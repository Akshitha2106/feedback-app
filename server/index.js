const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/feedbackDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const feedbackSchema = new mongoose.Schema({
  rating: Number,
  comment: String,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// POST: Submit feedback
app.post("/api/feedback", async (req, res) => {
  const { rating, comment } = req.body;
  const feedback = new Feedback({ rating, comment });
  await feedback.save();
  res.status(201).json({ message: "Feedback saved!" });
});

// Utility: Analyze sentiment
const getSentiment = (comment) => {
  const positiveWords = ["good", "great", "excellent", "love", "amazing"];
  const negativeWords = ["bad", "poor", "terrible", "hate", "worst"];
  const lower = comment.toLowerCase();

  let score = 0;
  for (let word of positiveWords) if (lower.includes(word)) score++;
  for (let word of negativeWords) if (lower.includes(word)) score--;

  if (score > 0) return "Positive";
  if (score < 0) return "Negative";
  return "Neutral";
};

// GET: Fetch all feedback + stats
app.get("/api/feedback", async (req, res) => {
  const feedbackList = await Feedback.find();

  const total = feedbackList.length;
  const avgRating = (
    feedbackList.reduce((acc, f) => acc + f.rating, 0) / total
  ).toFixed(2);

  const sentiments = { Positive: 0, Negative: 0, Neutral: 0 };
  feedbackList.forEach((fb) => sentiments[getSentiment(fb.comment)]++);

  const mostCommonSentiment = Object.entries(sentiments).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  res.json({
    feedback: feedbackList,
    averageRating: avgRating,
    mostCommonSentiment,
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
