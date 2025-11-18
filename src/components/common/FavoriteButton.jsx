// src/components/common/FavoriteButton.jsx
import { useEffect } from "react";
import { Heart } from "lucide-react";
import { useIsFavorited } from "../../hooks/useFavorites";

/**
 * FavoriteButton
 * - uses useIsFavorited hook for API toggle + refetch
 * - accepts onToggle callback (called after toggle completes)
 */
export default function FavoriteButton({ recipeId, size = "md", onToggle }) {
  const { isFavorited, loading, toggleFavorite } = useIsFavorited(recipeId);

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  // call onToggle after loading changes from true->false (i.e. action finished)
  useEffect(() => {
    // nothing here; toggleFavorite returns result we can await in click handler,
    // but we also accept onToggle to refresh parents (handled in click below)
  }, []);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading) return;
    const res = await toggleFavorite(); // toggleFavorite already refetches favorites inside hook
    if (onToggle) {
      try {
        await onToggle(res);
      } catch (err) {
        // ignore
      }
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center
        transition-transform duration-150
        ${isFavorited ? "bg-red-500 text-white" : "bg-white/90 text-slate-700"}
        hover:scale-105 shadow
      `}
      title={isFavorited ? "Hapus dari favorit" : "Tambah ke favorit"}
    >
      <Heart
        className={`${iconSizes[size]} ${isFavorited ? "fill-current" : ""}`}
      />
    </button>
  );
}
