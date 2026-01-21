import { useEffect, useMemo, useState } from "react";
import {
  getAllGames,
  addWishlist,
  removeWishlist,
  getMyWishlist,
} from "../utils/api";
import logo from "../assets/logo.png";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [popup, setPopup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all games and user's wishlist
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all games
      const games = await getAllGames();
      setAllGames(games);

      // Fetch current user's wishlist
      const userWishlist = await getMyWishlist();

      setWishlist(userWishlist);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPopup({ message: "Failed to load data", color: "bg-red-500" });
    } finally {
      setIsLoading(false);
    }
  };

  const resolveGameImage = (game) => {
    const name = game?.gameName?.toLowerCase().trim();
    if (!name) {
      return logo;
    }
    const slug = name.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return slug ? `/images/games/${slug}.jpg` : logo;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-dismiss popup
  useEffect(() => {
    if (!popup) return undefined;
    const timer = setTimeout(() => setPopup(null), 2500);
    return () => clearTimeout(timer);
  }, [popup]);

  // Create a map of game IDs to game data for quick lookup
  const gameMap = useMemo(() => {
    const map = new Map();
    allGames.forEach((game) => {
      map.set(game.id, game);
    });
    return map;
  }, [allGames]);

  // Search suggestions
  const suggestions = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return [];

    // Get game IDs already in wishlist
    const wishlistGameIds = new Set(wishlist.map((item) => item.gameId));

    // Filter games that match search and aren't already in wishlist
    return allGames.filter(
      (game) =>
        (game.gameName || game.name || "").toLowerCase().includes(query) &&
        !wishlistGameIds.has(game.id),
    );
  }, [searchTerm, allGames, wishlist]);

  // Add game to wishlist
  const addToWishlist = async (game) => {
    try {
      // Add to wishlist via API
      await addWishlist(game.id);

      // Refetch data to get the latest wishlist
      await fetchData();

      setSearchTerm("");
      setPopup({
        message: "Game added to wishlist ✔",
        color: "bg-emerald-500",
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setPopup({
        message: "Failed to add game to wishlist",
        color: "bg-red-500",
      });
    }
  };

  // Remove game from wishlist
  const removeFromWishlist = async (wishlistId) => {
    if (!window.confirm("Remove this game from your wishlist?")) return;

    try {
      // Remove from wishlist via API
      await removeWishlist(wishlistId);

      // Refetch data to get the latest wishlist
      await fetchData();

      setPopup({ message: "Game removed", color: "bg-red-500" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setPopup({ message: "Failed to remove game", color: "bg-red-500" });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-vintage-cream text-vintage-brown font-roboto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-vintage-brown/20 border-t-vintage-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-vintage-brown/60">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-vintage-cream text-vintage-brown font-roboto">
      {/* Popup Notification */}
      {popup && (
        <div
          className={`fixed top-24 right-6 ${popup.color} text-white px-6 py-4 rounded-xl shadow-2xl z-[60]`}
        >
          {popup.message}
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-vintage-brown text-vintage-cream pt-32 pb-28">
        <div className="max-w-5xl mx-auto text-center px-4 translate-y-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-vintage-accent/20 flex items-center justify-center text-4xl">
            ❤️
          </div>
          <h1 className="text-4xl font-playfair font-bold mb-4">My Wishlist</h1>
          <p className="text-base opacity-80 max-w-xl mx-auto">
            Games you'd like to trade for in the future
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 border-b border-vintage-brown/10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md border border-vintage-brown/10 p-6">
            <h2 className="text-xl font-playfair font-bold mb-4">
              Add Game to Wishlist
            </h2>
            <div className="relative">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search for a game (e.g. Catan)..."
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-vintage-accent"
                autoComplete="off"
              />
              {searchTerm && (
                <div className="absolute w-full bg-white border border-vintage-brown/20 rounded-xl mt-1 shadow-lg max-h-64 overflow-y-auto z-10">
                  {suggestions.length === 0 ? (
                    <div className="px-4 py-3 text-vintage-brown/40">
                      {allGames.length === 0
                        ? "Loading games..."
                        : "No matching games found"}
                    </div>
                  ) : (
                    suggestions.map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => addToWishlist(game)}
                        className="w-full text-left px-4 py-3 hover:bg-vintage-cream transition flex items-center gap-3"
                      >
                        <span className="text-2xl">{game.emoji || "🎲"}</span>
                        <div>
                          <div className="font-medium">
                            {game.gameName || game.name}
                          </div>
                          <div className="text-sm text-vintage-brown/60">
                            {game.maxMinPlayers || game.players || "Unknown"} ·
                            {game.minAge ? ` Age ${game.minAge}+` : " Unknown"}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Wishlist Games Section */}
      <section className="py-20 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          {wishlist.length > 0 && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-playfair font-bold">
                {wishlist.length === 1 ? "1 Game" : `${wishlist.length} Games`}
              </h2>
            </div>
          )}

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-vintage-brown/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <p className="text-vintage-brown/40 text-lg">
                Your wishlist is empty
              </p>
              <p className="text-sm text-vintage-brown/30 mt-1">
                Start adding games you'd like to trade for!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-2xl shadow-md border border-vintage-brown/10 p-6 hover:-translate-y-2 hover:shadow-lg transition cursor-default text-left"
                >
                  <img
                      src={resolveGameImage(game)}
                      alt={game.gameName}
                      onError={(e) => {
                        e.target.src = logo;
                      }}
                      className="max-h-full max-w-full object-contain"
                  />
                  <h3 className="text-xl font-medium mb-1">{game.gameName}</h3>
                  <p className="text-sm opacity-80">
                    {game.maxMinPlayers} Players · {game.yearPublished}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(game.id)}
                    className="mt-4 text-red-500 text-sm font-medium hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WishlistPage;
