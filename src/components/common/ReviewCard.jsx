// src/components/common/ReviewCard.jsx

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      {/* Header: Nama + Tanggal */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-slate-800">{review.username || "Pengguna"}</h4>

          {/* Rating */}
          <div className="flex gap-1 mt-1">
            {[...Array(review.rating)].map((_, i) => (
              <span key={i} className="text-yellow-500 text-lg">★</span>
            ))}
          </div>
        </div>

        <span className="text-slate-400 text-sm">
          {new Date(review.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Comment */}
      <p className="text-slate-700 mt-2">{review.comment}</p>
    </div>
  );
}
