// src/main.jsx
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import ProfilePage from './pages/ProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetail from './components/recipe/RecipeDetail';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css'
import PWABadge from './PWABadge';

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [mode, setMode] = useState('list'); // 'list', 'detail', 'create', 'edit'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('makanan');
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  // ⭐⭐⭐ DEEP LINK HANDLER (SHARE LINK)
  useEffect(() => {
    const path = window.location.pathname.split("/");

    // Format share link: /resep/:category/:id
    if (path[1] === "resep" && path.length === 4) {
      const category = path[2];
      const id = path[3];

      setSelectedCategory(category);
      setSelectedRecipeId(id);
      setMode("detail");  // langsung buka detail
    }
  }, []);

  const handleSplashComplete = () => setShowSplash(false);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
  };

  const handleCreateRecipe = () => setMode('create');

  const handleRecipeClick = (recipeId, category) => {
    setSelectedRecipeId(recipeId);
    setSelectedCategory(category || currentPage);
    setMode('detail');
  };

  const handleEditRecipe = (recipeId) => {
    setEditingRecipeId(recipeId);
    setMode('edit');
  };

  const handleBack = () => {
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
  };

  const handleCreateSuccess = (newRecipe) => {
    alert('Resep berhasil dibuat!');
    setMode('list');
    if (newRecipe?.category) {
      setCurrentPage(newRecipe.category);
    }
  };

  const handleEditSuccess = () => {
    alert('Resep berhasil diperbarui!');
    setMode('list');
  };

  const renderCurrentPage = () => {
    if (mode === 'create') {
      return <CreateRecipePage onBack={handleBack} onSuccess={handleCreateSuccess} />;
    }

    if (mode === 'edit') {
      return <EditRecipePage recipeId={editingRecipeId} onBack={handleBack} onSuccess={handleEditSuccess} />;
    }

    if (mode === 'detail') {
      return <RecipeDetail recipeId={selectedRecipeId} category={selectedCategory} onBack={handleBack} onEdit={handleEditRecipe} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
      case 'makanan':
        return <MakananPage onRecipeClick={handleRecipeClick} />;
      case 'minuman':
        return <MinumanPage onRecipeClick={handleRecipeClick} />;
      case 'profile':
        return <ProfilePage onRecipeClick={handleRecipeClick} />;
      default:
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {mode === 'list' && (
        <>
          <DesktopNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
          <MobileNavbar 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
        </>
      )}

      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("SW registered"))
      .catch(err => console.log("SW failed:", err));
  });
}
