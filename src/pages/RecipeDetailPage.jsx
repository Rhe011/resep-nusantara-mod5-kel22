// src/pages/RecipeDetailPage.jsx
import { useState } from "react";
import { useRecipe } from "../hooks/useRecipes";
import { useReviews, useCreateReview } from "../hooks/useReviews";
import { useIsFavorited } from "../hooks/useFavorites";
import { getUserIdentifier } from "../hooks/useFavorites";
import { formatDate, getDifficultyColor, getStarRating } from "../utils/helpers";

import { Heart, Clock, Users, ChefHat } from "lucide-react";

export default function RecipeDetailPage({ recipeId, onBack }) {
  const { recipe, loading: recipeLoading, error: recipeError } = useRecipe(recipeId);
  const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useReviews(recipeId);
  const { createReview, loading: createLoading } = useCreateReview();
  const { isFavorited, loading: favLoading, toggleFavorite } = useIsFavorited(recipeId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const reviewData = {
      user_identifier: getUserIdentifier(),
      rating,
      comment: comment.trim(),
    };

    const result = await createReview(recipeId, reviewData);

    if (result) {
      setComment("");
      setRating(5);
      refetchReviews();
      setShowModal(false);
    }
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite();
  };

  // ============================
  // Loading & Error Handling
  // ============================
  if (recipeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat resep...</p>
        </div>
      </div>
    );
  }

  if (recipeError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {recipeError}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Resep tidak ditemukan</p>
      </div>
    );
  }

  // ============================
  // Main Content
  // ============================
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Kembali
          </button>

          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            className={`p-2 rounded-full transition-colors ${
              isFavorited ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"
            }`}
          >
            <Heart className={isFavorited ? "fill-current" : ""} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Recipe Image */}
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="w-full h-96 object-cover rounded-2xl shadow-lg mb-8"
        />

        {/* Recipe Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>

            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {recipe.category}
            </span>

            {recipe.is_featured && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                ⭐ Featured
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{recipe.description}</p>

          {/* Recipe Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem icon={Clock} title="Persiapan" value={`${recipe.prep_time} menit`} />
            <InfoItem icon={ChefHat} title="Memasak" value={`${recipe.cook_time} menit`} />
            <InfoItem icon={Users} title="Porsi" value={`${recipe.servings} orang`} />
            <InfoItem
              icon={Heart}
              title="Rating"
              value={`${recipe.average_rating?.toFixed(1) || "N/A"} (${recipe.review_count})`}
            />
          </div>
        </div>

        {/* Ingredients */}
        <Section title="Bahan-bahan">
          <ul className="space-y-2">
            {recipe.ingredients?.map((ing, index) => (
              <li key={ing.id || index} className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                {ing.name} - {ing.quantity}
              </li>
            ))}
          </ul>
        </Section>

        {/* Steps */}
        <Section title="Langkah-langkah">
          <ol className="space-y-4">
            {recipe.steps?.map((step) => (
              <li key={step.id} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {step.step_number}
                </span>
                <p className="text-gray-700 flex-1 pt-1">{step.instruction}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ============================
            REVIEWS SECTION NEW
        ============================ */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Ulasan ({reviews.length})</h2>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tulis Ulasan
            </button>
          </div>

          {reviewsLoading ? (
            <p className="text-gray-500">Memuat ulasan...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">Belum ada ulasan.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {review.username || "Pengguna"}
                      </p>

                      <div className="flex gap-1 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">★</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-slate-400">
                      {new Date(review.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {review.comment && (
                    <p className="text-gray-700 mt-3">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ============================
            MODAL FORM REVIEW
        ============================ */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Tulis Ulasan</h2>

              <form onSubmit={handleSubmitReview}>
                {/* Rating */}
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Comment */}
                <label className="block text-sm font-medium mb-2">Komentar</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border rounded-lg p-2 h-28 mb-4"
                  placeholder="Tulis ulasanmu..."
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border"
                  >
                    Batal
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Simple reusable section wrapper
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

// Simple item component for recipe info rows
function InfoItem({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-indigo-600" />
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
