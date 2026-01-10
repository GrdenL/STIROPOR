import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { mockListings } from "../data/mockListings";
import { mockGames } from "../data/mockGames";
import logo from "../assets/logo.png";

const GameDetailsPage = () => {
  const { id } = useParams();
  const gameId = Number(id);

  const game = mockGames.find((g) => g.gameId === gameId);

  const listings = mockListings.filter(
    (l) => l.gameId === gameId && l.isActive
  );

  const [showListings, setShowListings] = useState(false);
  const [openImage, setOpenImage] = useState({});

  if (!game) {
    return (
      <p className="text-center mt-10 text-vintage-brown">
        Game not found.
      </p>
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

  const toggleImage = (listingId) => {
    setOpenImage((prev) => ({
      ...prev,
      [listingId]: !prev[listingId],
    }));
  };

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
            src={game.media?.href}
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
                {game.genres.map((g) => g.genreName).join(", ")}
              </p>
            </div>

            {/* VIEW LISTINGS BUTTON */}
            <button
              disabled={!hasListings}
              onClick={() =>
                hasListings && setShowListings((prev) => !prev)
              }
              className={`mt-6 px-6 py-3 rounded-full text-white transition
                ${
                  hasListings
                    ? "bg-vintage-accent hover:bg-amber-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {hasListings
                ? `View listings (${listings.length})`
                : "No listings available"}
            </button>

            {/* LISTINGS */}
            {hasListings && showListings && (
              <div className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-2">
                {listings.map((listing) => (
                  <div
                    key={listing.listingId}
                    className="border rounded-lg p-4 bg-white shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-vintage-brown">
                        <p className="font-semibold">
                          {listing.owner.username}
                        </p>
                        <p>
                          {listing.owner.town}, {listing.owner.country}
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

                        <Link
                          to={`/offer/${listing.listingId}`}
                          className="text-sm bg-vintage-accent text-white px-4 py-2 rounded-full hover:bg-amber-700"
                        >
                          Offer trade
                        </Link>
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;
