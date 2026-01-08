import { useParams, Link } from "react-router-dom";
import { mockListings } from "../data/mockListings";
import logo from "../assets/logo.png";

const difficultyMap = {
  1: { label: "Easy", color: "bg-green-100 text-green-700" },
  2: { label: "Easy", color: "bg-green-100 text-green-700" },
  3: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  4: { label: "Hard", color: "bg-red-100 text-red-700" },
  5: { label: "Hard", color: "bg-red-100 text-red-700" },
};

const GameDetailsPage = () => {
  const { id } = useParams();

  const listing = mockListings.find(
    (l) => l.listingId.toString() === id
  );

  if (!listing) {
    return <p className="text-center mt-10">Listing not found.</p>;
  }

  const game = listing.game;
  const difficulty = difficultyMap[game.complexity];

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
          {/* Game Image */}
          <img
            src={game.media.href}
            alt={game.gameName}
            onError={(e) => { e.target.src = logo; }}
            className="rounded-xl shadow-md"
          />

          <div className="flex flex-col">
            <h1 className="text-3xl font-playfair font-bold text-vintage-brown mb-3">
              {game.gameName}
            </h1>

            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${difficulty.color}`}
              >
                {difficulty.label}
              </span>
              <span className="text-sm text-vintage-brown/70">
                {game.avgPlayTime} min
              </span>
            </div>

            <p className="text-vintage-brown/80 mb-2">{listing.description}</p>

            <p className="mb-2">
              <strong>Publisher:</strong> {game.publisher}
            </p>

            <p className="mb-2">
              <strong>Year Published:</strong> {game.yearPublished}
            </p>

            <p className="mb-2">
              <strong>Players:</strong> {game.maxMinPlayers}
            </p>

            <p className="mb-2">
              <strong>Condition:</strong> {listing.condition}
            </p>

            <p className="mb-2">
              <strong>Genres:</strong>{" "}
              {game.genres?.map((g) => g.genreName).join(", ") ?? "Unknown"}
            </p>

            <p className="mb-4">
              <strong>Owner:</strong> {listing.owner.username} (
              {listing.owner.town}, {listing.owner.country})
            </p>

            <button className="bg-vintage-accent text-white px-6 py-3 rounded-full hover:bg-amber-700 transition mt-auto">
              Offer Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;
