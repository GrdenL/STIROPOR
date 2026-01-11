import { useState } from "react";
import { Link } from "react-router-dom";
import { mockGames } from "../data/mockGames";
import logo from  "../assets/logo.png"
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

// 👉 izvuci sve jedinstvene žanrove
const allGenres = Array.from(
  new Set(
    mockGames.flatMap((g) => g.genres.map((genre) => genre.genreName))
  )
).sort();

const GamesPage = () => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [players, setPlayers] = useState("All");
  const [genre, setGenre] = useState("All");

  const filteredGames = mockGames.filter((game) => {
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

    const matchesGenre =
      genre === "All" ||
      game.genres.some((g) => g.genreName === genre);

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesPlayers &&
      matchesGenre
    );
  });

  return (
    <div className="bg-vintage-cream min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-playfair font-bold text-vintage-brown text-center mb-8">
          Browse Games
        </h1>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-10">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-1/3 px-4 py-2 border border-vintage-brown/30 rounded-lg"
          />

          <div className="flex flex-wrap gap-3 justify-center">
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

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="All">All genres</option>
              {allGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Games grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game) => {
            const difficulty = difficultyMap[game.complexity];

            return (
              <div
                key={game.gameId}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition flex flex-col"
              >
                <div className="w-full h-48 bg-white rounded-t-xl flex items-center justify-center p-4">
                  <img
                    src={game.media.href}
                    alt={game.gameName}
                    onError={(e) => {
                      e.target.src = logo;
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

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
                    Avg playtime: {game.avgPlayTime} min
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {game.genres.map((g) => (
                      <span
                        key={g.genreId}
                        className="text-xs bg-vintage-brown/10 text-vintage-brown px-2 py-1 rounded-full"
                      >
                        {g.genreName}
                      </span>
                    ))}
                  </div>

                  <div className="flex-grow" />

                  <div className="flex justify-end mt-4">
                    <Link
                      to={`/games/${game.gameId}`}
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

        {filteredGames.length === 0 && (
          <p className="text-center text-vintage-brown/70 mt-12">
            No games match your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
