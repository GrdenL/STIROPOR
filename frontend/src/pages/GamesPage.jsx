import { useState } from "react";
import { Link } from "react-router-dom";
import { mockListings } from "../data/mockListings";
import logo from "../assets/logo.png";


const difficultyMap = {
  1: { label: "Easy", color: "bg-green-100 text-green-700" },
  2: { label: "Easy", color: "bg-green-100 text-green-700" },
  3: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  4: { label: "Hard", color: "bg-red-100 text-red-700" },
  5: { label: "Hard", color: "bg-red-100 text-red-700" },
};

const playerCountMatches = (range, selected) => {
  if (selected === "All") return true;

  const selectedNumber = Number(selected);

  if (range.includes("+")) {
    const min = Number(range.replace("+", ""));
    return selectedNumber >= min;
  }

  const [min, max] = range.split("–").map(Number);
  return selectedNumber >= min && selectedNumber <= max;
};

const GamesPage = () => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [players, setPlayers] = useState("All");

  const filteredListings = mockListings.filter((listing) => {
    const game = listing.game;

    const matchesSearch = game.gameName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDifficulty =
      difficulty === "All" ||
      difficultyMap[game.complexity].label === difficulty;

    const matchesPlayers = playerCountMatches(
      game.maxMinPlayers,
      players
    );

    return matchesSearch && matchesDifficulty && matchesPlayers;
  });

  return (
    <div className="bg-vintage-cream min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-playfair font-bold text-vintage-brown text-center mb-8">
          Browse Games
        </h1>

        {/* Search & filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-vintage-brown/30 rounded-lg"
          />

          <div className="flex gap-3">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="All">Any players</option>
              <option value="1">1 player</option>
              <option value="2">2 players</option>
              <option value="3">3 players</option>
              <option value="4">4+ players</option>
            </select>
          </div>
        </div>

        {/* Listings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => {
            const game = listing.game;
            const difficulty = difficultyMap[game.complexity];

            return (
              <div
                key={listing.listingId}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition flex flex-col"
              >
                <img
                  src={game.media.href}
                  alt={game.gameName}
                  onError={(e) => { e.target.src = logo; }}
                  className="w-full h-48 object-cover rounded-t-xl"
                />

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-playfair font-semibold text-vintage-brown">
                      {game.gameName}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${difficulty.color}`}
                    >
                      {difficulty.label}
                    </span>
                  </div>

                  <p className="text-sm text-vintage-brown/70">
                    Players: {game.maxMinPlayers}
                  </p>

                  <p className="text-sm text-vintage-brown/70">
                    Condition: {listing.condition}
                  </p>

                  {/* Spacer */}
                  <div className="flex-grow" />

                  <div className="flex justify-end mt-4">
                    <Link
                      to={`/games/${listing.listingId}`}
                      className="text-sm font-medium text-vintage-accent hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
