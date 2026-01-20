import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGameById, getListingsByGameId } from "../utils/api";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { deleteListingById } from "../utils/api";


const resolveGameImage = (game) => {
  const name = game?.gameName?.toLowerCase().trim();
  if (!name) {
    return logo;
  }
  const slug = name.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return slug ? `/images/games/${slug}.jpg` : logo;
};

const GameDetailsPage = () => {
  const { id } = useParams();
  const gameId = Number(id);
  const { user } = useAuth();

  // Fetch game data
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listings data
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  const [showListings, setShowListings] = useState(false);
  const [openImage, setOpenImage] = useState({});


  //Handle Admin Delete Listing
  const handleDeleteListing = async (listingId) => {
  if (!window.confirm("Are you sure you want to delete this listing?")) return;

  try {
    await deleteListingById(listingId);

    setListings((prev) =>
      prev.filter((l) => l.listingId !== listingId)
    );
  } catch (err) {
    console.error("Failed to delete listing", err);
    alert("Failed to delete listing");
  }
};


  // Fetch game details
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const data = await getGameById(gameId);
        setGame(data);
      } catch (err) {
        setError(err.message);
        console.error("Error loading game:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  // Fetch listings for this game
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setListingsLoading(true);
        const data = await getListingsByGameId(gameId);
        // Filter only active listings
        setListings(data?.filter((l) => l.isActive !== false) || []);
      } catch (err) {
        console.error("Error loading listings:", err);
        setListings([]);
      } finally {
        setListingsLoading(false);
      }
    };

    fetchListings();
  }, [gameId]);

  const toggleImage = (listingId) => {
    setOpenImage((prev) => ({
      ...prev,
      [listingId]: !prev[listingId],
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-vintage-cream min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-vintage-brown text-xl">Loading game details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-vintage-cream min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-600 text-xl">Error: {error}</p>
          <Link
            to="/games"
            className="text-sm text-vintage-accent hover:underline mt-4 inline-block"
          >
            ← Back to games
          </Link>
        </div>
      </div>
    );
  }

  // Game not found
  if (!game) {
    return (
      <div className="bg-vintage-cream min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-vintage-brown">Game not found.</p>
          <Link
            to="/games"
            className="text-sm text-vintage-accent hover:underline mt-4 inline-block"
          >
            ← Back to games
          </Link>
        </div>
      </div>
    );
  }

  const hasListings = listings.length > 0;

  const complexityLabel =
    game.complexity <= 1
      ? "Easy"
      : game.complexity === 2
      ? "Medium"
      : game.complexity === 3
      ? "Hard"
      : "Very hard";

  const complexityColor =
    game.complexity <= 1
      ? "text-green-600"
      : game.complexity === 2
      ? "text-yellow-600"
      : game.complexity === 3
      ? "text-orange-600"
      : "text-red-600";
  const gameImage = resolveGameImage(game);

  return (
    <div className="bg-vintage-cream min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/games"
          className="text-sm text-vintage-accent hover:underline"
        >
          ← Back to games
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* GAME IMAGE */}
          <img
            src={gameImage}
            alt={game.gameName}
            onError={(e) => (e.target.src = logo)}
            className="rounded-xl shadow-md"
          />

          {/* DETAILS */}
          <div>
            <h1 className="text-3xl font-playfair font-bold text-vintage-brown mb-2">
              {game.gameName}
            </h1>

            <p className="text-vintage-brown/70 mb-4">
              {game.publisher} · {game.yearPublished}
            </p>

            <div className="space-y-2 text-vintage-brown">
              <p>
                <strong>Players:</strong> {game.maxMinPlayers}
              </p>
              <p>
                <strong>Average play time:</strong> {game.avgPlayTime} min
              </p>
              <p>
                <strong>Complexity:</strong>{" "}
                <span className={`font-semibold ${complexityColor}`}>
                  {complexityLabel}
                </span>
              </p>
              <p>
                <strong>Genres:</strong>{" "}
                {game.genres?.map((g) => g.genreName).join(", ")}
              </p>
            </div>

            {/* VIEW LISTINGS BUTTON */}
            <button
              disabled={!hasListings || listingsLoading}
              onClick={() => hasListings && setShowListings((prev) => !prev)}
              className={`mt-6 px-6 py-3 rounded-full text-white transition
                ${
                  hasListings && !listingsLoading
                    ? "bg-vintage-accent hover:bg-amber-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {listingsLoading
                ? "Loading listings..."
                : hasListings
                ? `View listings (${listings.length})`
                : "No listings available"}
            </button>

            {/* LISTINGS */}
            {hasListings && showListings && (
              <div className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-2">
                {listings.map((listing) => {
                  const listingUserId =
                    listing.user?.userId ?? listing.owner?.userId;
                  const isOwnListing =
                    listingUserId !== undefined &&
                    user?.userId !== undefined &&
                    Number(listingUserId) === Number(user.userId);
                  const isAdmin = user?.role === "ADMIN";

                  return (
                    <div
                      key={listing.listingId}
                      className="border rounded-lg p-4 bg-white shadow-sm space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-vintage-brown">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {listing.owner?.username ||
                                listing.user?.username ||
                                "Unknown User"}
                            </p>
                            {isOwnListing && (
                              <span className="text-xs text-vintage-brown/60 bg-vintage-cream px-2 py-1 rounded-full border border-vintage-brown/10">
                                Moj listing
                              </span>
                            )}
                          </div>
                          <p>
                            {listing.owner?.town?.townName ||
                              listing.user?.town?.townName ||
                              "Unknown"}
                            ,{" "}
                            {listing.owner?.town?.country?.countryName ||
                              listing.user?.town?.country?.countryName ||
                              "Unknown"}
                          </p>
                          <p className="italic">
                            Condition: {listing.condition}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleImage(listing.listingId)}
                            className="text-sm border border-vintage-accent text-vintage-accent px-3 py-2 rounded-full hover:bg-vintage-accent hover:text-white transition"
                          >
                            {openImage[listing.listingId]
                              ? "Hide image"
                              : "Show image"}
                          </button>

                          {!isOwnListing && (
                            <Link
                              to={`/offer/${listing.listingId}`}
                              className="text-sm bg-vintage-accent text-white px-4 py-2 rounded-full hover:bg-amber-700"
                            >
                              Offer trade
                            </Link>
                          )}

                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteListing(listing.listingId)}
                              className="text-sm bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
                            >
                              Delete listing
                            </button>
                          )}

                        </div>
                      </div>

                      {/* SINGLE IMAGE */}
                      {openImage[listing.listingId] && (
                        <img
                          src={listing.media?.href || logo}
                          alt="Listing"
                          onError={(e) => (e.target.src = logo)}
                          className="h-32 w-32 object-cover rounded-lg border"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;
