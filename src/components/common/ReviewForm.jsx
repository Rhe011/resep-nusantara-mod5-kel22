// src/components/common/ReviewForm.jsx
import { useState } from "react";

export default function ReviewForm({ recipeId, onSubmit, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    await onSubmit({
      recipe_id: recipeId,
      rating,
      comment,
    });

    onClose(); // Tutup modal
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Tulis Ulasan</h2>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <label className="block font-medium mb-2">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded-lg p-2 mb-4"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} ★</option>
            ))}
          </select>

          {/* Comment */}
          <label className="block font-medium mb-2">Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tulis pengalamanmu..."
            className="w-full border rounded-lg p-2 h-28 mb-4"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
