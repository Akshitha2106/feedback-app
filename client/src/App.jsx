import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [mostCommonSentiment, setMostCommonSentiment] = useState("");

  const fetchFeedback = async () => {
    const res = await fetch("http://localhost:5000/api/feedback");
    const data = await res.json();
    setFeedback(data.feedback);
    setAverageRating(data.averageRating);
    setMostCommonSentiment(data.mostCommonSentiment);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and comment.");
      return;
    }

    await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    setRating(0);
    setComment("");
    fetchFeedback();
  };

  return (
    <div className="container">
      <h1>🌟 Feedback App</h1>

      <form onSubmit={handleSubmit} className="form">
        <label>Rating:</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${
                hoverRating >= star || rating >= star ? "filled" : ""
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <label>Comment:</label>
        <textarea
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your feedback..."
        />

        <button type="submit">Submit</button>
      </form>

      <div className="stats">
        <h2>📊 Feedback Stats</h2>
        <p>
          <strong>Average Rating:</strong> {averageRating}
        </p>
        <p>
          <strong>Most Common Sentiment:</strong> {mostCommonSentiment}
        </p>
      </div>

      <div className="list">
        <h2>📝 All Feedback</h2>
        {feedback.map((fb, index) => (
          <div key={index} className="card">
            <p>
              <strong>Rating:</strong> {fb.rating} ★
            </p>
            <p>
              <strong>Comment:</strong> {fb.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
