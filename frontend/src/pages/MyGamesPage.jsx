import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyListings, deleteListingById } from "../utils/api";

const conditionBadges = {
  New: "bg-green-100 text-green-700",
  "Like New": "bg-emerald-100 text-emerald-700",
  Good: "bg-blue-100 text-blue-700",
  Acceptable: "bg-amber-100 text-amber-700",
  Poor: "bg-red-100 text-red-700",
};

const MyGamesPage = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [condition, setCondition] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadListings = async () => {
      setLoading(true);
      setLoadError("");
      const data = await getMyListings();
      if (!isMounted) return;
      if (!data) {
        setLoadError("Failed to load your listings.");
        setListings([]);
        setLoading(false);
        return;
      }
      setListings(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    loadListings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (listingId, e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to delete this listing? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(listingId);
    setDeleteError("");

    try {
      const success = await deleteListingById(listingId);

      if (success) {
        // Remove the deleted listing from state
        setListings((prevListings) =>
          prevListings.filter((listing) => listing.listingId !== listingId)
        );
      } else {
        setDeleteError("Failed to delete listing. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      setDeleteError("An error occurred while deleting. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredGames = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = listings.filter((game) => {
      const matchesSearch = (game.gameName || "").toLowerCase().includes(term);
      const matchesCondition = !condition || game.condition === condition;
      return matchesSearch && matchesCondition;
    });

    if (sortBy === "name") {
      filtered.sort((a, b) =>
        (a.gameName || "").localeCompare(b.gameName || "")
      );
    } else if (sortBy === "condition") {
      const order = { New: 1, "Like New": 2, Good: 3, Acceptable: 4, Poor: 5 };
      filtered.sort((a, b) => order[a.condition] - order[b.condition]);
    } else if (sortBy === "players") {
      filtered.sort((a, b) => {
        return (a.listingId ?? 0) - (b.listingId ?? 0);
      });
    }

    return filtered;
  }, [condition, listings, searchTerm, sortBy]);

  return (
    <div className="bg-vintage-cream text-vintage-brown font-roboto">
      <section className="bg-vintage-brown text-vintage-cream pt-32 pb-28">
        <div className="max-w-5xl mx-auto text-center px-4 translate-y-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-vintage-accent/20 flex items-center justify-center">
            <span className="text-3xl">🎲</span>
          </div>
          <h1 className="text-4xl font-playfair font-bold mb-4">My Games</h1>
          <p className="text-base opacity-80 max-w-xl mx-auto">
            View your listed games
          </p>
        </div>
      </section>

      <section className="py-12 border-b border-vintage-brown/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96 relative">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search your games..."
                className="w-full border rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-vintage-accent"
              />
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-vintage-brown/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="flex-1 md:flex-none border rounded-xl px-4 py-3 focus:ring-2 focus:ring-vintage-accent cursor-pointer"
              >
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Acceptable">Acceptable</option>
                <option value="Poor">Poor</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 md:flex-none border rounded-xl px-4 py-3 focus:ring-2 focus:ring-vintage-accent cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="condition">Sort by Condition</option>
                <option value="players">Sort by Listing</option>
              </select>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/add-edit"
              className="inline-flex items-center gap-2 bg-vintage-accent text-white px-6 py-3 rounded-full hover:bg-amber-700 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Game
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-playfair font-bold">
              {filteredGames.length} Games in Collection
            </h2>
            {deleteError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {deleteError}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16 text-vintage-brown/60">
              Loading your listings...
            </div>
          ) : loadError ? (
            <div className="text-center py-16 text-red-600">{loadError}</div>
          ) : filteredGames.length === 0 ? (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-vintage-brown/40 text-lg">No games found</p>
              <p className="text-sm text-vintage-brown/30 mt-1">
                Try adjusting your filters or add a new game!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <div
                  key={game.listingId ?? game.gameName}
                  className="bg-white rounded-2xl shadow-md border border-vintage-brown/10 p-6 hover:-translate-y-2 hover:shadow-lg transition cursor-pointer group relative"
                  onClick={() => {
                    const detailId =
                      game.gameId ?? game.game?.gameId ?? game.listingId;
                    if (detailId !== undefined && detailId !== null) {
                      navigate(`/games/${detailId}`);
                    }
                  }}
                >
                  <span className="absolute top-3 right-3 text-xs text-vintage-brown/70 bg-vintage-cream px-2 py-1 rounded-full border border-vintage-brown/10">
                    Moj listing
                  </span>
                  <div className="h-40 bg-vintage-cream rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-vintage-brown/10">
                    {game.mediaHref ? (
                      <img
                        src={game.mediaHref}
                        alt={game.gameName || "Listing image"}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-4xl text-vintage-brown/40">🎲</span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    {game.gameName || "Untitled game"}
                  </h3>
                  <p className="text-sm opacity-80 mb-3">
                    {game.description || "Listing"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        conditionBadges[game.condition] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {game.condition}
                    </span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/add-edit/${game.listingId}`);
                        }}
                        className="text-vintage-accent hover:text-amber-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(game.listingId, e)}
                        disabled={deletingId === game.listingId}
                        className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === game.listingId
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyGamesPage;
