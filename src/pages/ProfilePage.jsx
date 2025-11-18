// src/pages/ProfilePage.jsx
import { useState, useRef } from "react";
import { Camera, Pencil } from "lucide-react";
import {
  getUserProfile,
  updateAvatar,
  updateUsername,
} from "../services/userService";
import { useFavorites } from "../hooks/useFavorites";
import FavoriteButton from "../components/common/FavoriteButton";

export default function ProfilePage({ onRecipeClick }) {
  const initialProfile = getUserProfile();

  const [username, setUsername] = useState(initialProfile.username);
  const [avatar, setAvatar] = useState(initialProfile.avatar);
  const [editingName, setEditingName] = useState(false);
  const [tab, setTab] = useState("all"); // all | makanan | minuman

  const fileInputRef = useRef(null);

  const { favorites, loading, error, refetch } = useFavorites();

  // Upload avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      updateAvatar(base64);
      setAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  // Save username
  const handleSaveUsername = () => {
    if (!username.trim()) return;
    updateUsername(username);
    setEditingName(false);
  };

  // filter favorites by tab
  const filtered = favorites.filter((f) => {
    if (tab === "all") return true;
    return (f.category || "").toLowerCase() === tab;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-4">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* PROFILE HEADER */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 mb-8">
          <div className="flex items-center gap-6">
            
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatar || "/LOGORN.png"}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border"
              />

              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Username */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {editingName ? (
                  <>
                    <input
                      className="border px-3 py-1 rounded-lg"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                      onClick={handleSaveUsername}
                      className="text-blue-600 font-medium"
                    >
                      Simpan
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold">{username}</h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-slate-500 hover:text-slate-700"
                      title="Edit username"
                    >
                      <Pencil size={16} />
                    </button>
                  </>
                )}
              </div>

              <p className="text-slate-500 mt-1">Pecinta kuliner Nusantara</p>

              <div className="mt-3 text-sm text-blue-600 font-semibold">
                {favorites.length} Resep Favorit
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              tab === "all" ? "bg-slate-800 text-white" : "bg-white text-slate-700"
            }`}
          >
            Semua
          </button>

          <button
            onClick={() => setTab("makanan")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              tab === "makanan" ? "bg-slate-800 text-white" : "bg-white text-slate-700"
            }`}
          >
            Makanan
          </button>

          <button
            onClick={() => setTab("minuman")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              tab === "minuman" ? "bg-slate-800 text-white" : "bg-white text-slate-700"
            }`}
          >
            Minuman
          </button>
        </div>

        {/* FAVORITES GRID */}
        <h3 className="text-xl font-semibold mb-4">Resep Favorit</h3>

        {loading ? (
          <p className="text-slate-600">Memuat...</p>
        ) : error ? (
          <p className="text-red-500">{error.message || "Gagal memuat favorit."}</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500">Belum ada resep favorit.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden"
              >
                {/* Favorite Button */}
                <div className="absolute top-3 right-3 z-20">
                  <FavoriteButton
                    recipeId={item.id}
                    size="md"
                    onToggle={async () => {
                      try { await refetch(); } catch { }
                    }}
                  />
                </div>

                {/* CARD → NAVIGATE TO DETAIL */}
                <div
                  onClick={() =>
                    onRecipeClick &&
                    onRecipeClick(item.id, item.category)
                  }
                  className="cursor-pointer"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-44 object-cover"
                  />

                  <div className="p-4">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {item.category === "makanan" ? "Makanan" : "Minuman"}
                    </span>

                    <h4 className="font-semibold text-lg mt-2">{item.name}</h4>

                    <div className="flex items-center justify-between text-sm text-slate-500 mt-3">
                      <span>👥 {item.servings ?? "-"}</span>
                      <span>⏱ {item.cook_time ?? "-"} menit</span>
                      <span>
                        {item.difficulty === "mudah"
                          ? "🟢 Mudah"
                          : item.difficulty === "sedang"
                          ? "🟡 Sedang"
                          : "🔴 Sulit"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
