"use client";

import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import '../../app/globals.css';

const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState([
    { name: "John Doe", rating: 5, comment: "Amazing gym and great staff!" },
    { name: "Emily Smith", rating: 4, comment: "Clean facilities and friendly trainers." },
    { name: "Alex Johnson", rating: 5, comment: "Top-notch equipment. Highly recommend!" },
    { name: "Sarah Lee", rating: 4, comment: "Great atmosphere and professional trainers." },
    { name: "David Brown", rating: 5, comment: "Best gym experience I've had!" },
  ]);

  const [formData, setFormData] = useState({ name: "", rating: 0, comment: "" });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [feedbacks.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.rating && formData.comment) {
      setFeedbacks([formData, ...feedbacks]);
      setFormData({ name: "", rating: 0, comment: "" });
      alert("Thank you for your feedback!");
    } else {
      alert("Please complete all fields before submitting.");
    }
  };

  const handleRatingClick = (star: number) => {
    setFormData((prev) => ({ ...prev, rating: star }));
  };


  return (
    <div className="min-h-screen bg-black text-white p-8 pt-28">
      <h1 className="text-4xl font-bold text-center mb-10">Client Feedback</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#111] rounded-2xl shadow-lg p-6 max-w-xl mx-auto mb-12 border border-orange-500"
      >
        <h2 className="text-2xl font-semibold mb-4 text-orange-300 text-center">Leave Your Feedback</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 rounded bg-black border border-gray-500 text-white mb-4"
          required
        />

        <div className="flex gap-2 mb-4 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} onClick={() => handleRatingClick(star)} className="cursor-pointer">
              {formData.rating >= star ? (
                <FaStar className="text-orange-400 text-xl" />
              ) : (
                <FaRegStar className="text-gray-500 text-xl" />
              )}
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your comment..."
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          rows={4}
          className="w-full p-3 rounded bg-black border border-gray-500 text-white mb-4"
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          Submit Feedback
        </button>
      </form>

      <div className="max-w-5xl mx-auto overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / 3)}%)`
          }}
        >
          {feedbacks.concat(feedbacks).map((feedback, index) => (
            <div
              key={index}
              className="min-w-[300px] max-w-[300px] h-[220px] bg-[#1a1a1a] p-4 rounded-xl border border-orange-400 shadow-lg flex-shrink-0 flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, black 30%, #EE7838 100%)",
              }}
            >
              <h3 className="text-lg font-bold text-orange-300 text-center">{feedback.name}</h3>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) =>
                  i < feedback.rating ? (
                    <FaStar key={i} className="text-yellow-400 text-base" />
                  ) : (
                    <FaRegStar key={i} className="text-gray-600 text-base" />
                  )
                )}
              </div>
              <p className="text-base text-gray-300 text-center">&quot;{feedback.comment}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
