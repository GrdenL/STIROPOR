import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GamesPage from "./pages/GamesPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OfferTradePage from "./pages/OfferTradePage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import MyGamesPage from "./pages/MyGamesPage";
import MyTradesPage from "./pages/MyTradesPage";
import WishlistPage from "./pages/WishlistPage";
import AddEditGamePage from "./pages/AddEditGamePage";
import ProtectedRoutes from "./utils/protectedRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GameDetailsPage />} />

          <Route path="/offer/:listingId" element={<ProtectedRoutes><OfferTradePage/></ProtectedRoutes> } />
          <Route path="/profile" element={<ProtectedRoutes><ProfilePage /></ProtectedRoutes>} />
          <Route path="/profile/edit" element={<ProtectedRoutes><EditProfilePage /></ProtectedRoutes>} />
          <Route path="/my-games" element={<ProtectedRoutes><MyGamesPage /></ProtectedRoutes>} />
          <Route path="/my-trades" element={<ProtectedRoutes><MyTradesPage /></ProtectedRoutes>}/>
          <Route path="/add-edit" element={<ProtectedRoutes><AddEditGamePage /></ProtectedRoutes>} />
          <Route path="/wishlist" element={<ProtectedRoutes><WishlistPage /></ProtectedRoutes>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
