import { useEffect, useMemo, useState } from "react";

const gameDatabase = [
  { name: "Catan", players: "3–4 players", age: "Age 10+", emoji: "🎲" },
  { name: "Catan: Seafarers", players: "3–4 players", age: "Age 10+", emoji: "⛵" },
  { name: "Catan: Cities & Knights", players: "3–4 players", age: "Age 10+", emoji: "🏰" },
  { name: "Ticket to Ride", players: "2–5 players", age: "Age 8+", emoji: "🚂" },
  { name: "Pandemic", players: "2–4 players", age: "Age 8+", emoji: "🦠" },
  { name: "Azul", players: "2–4 players", age: "Age 8+", emoji: "🎨" },
  { name: "Splendor", players: "2–4 players", age: "Age 10+", emoji: "💎" },
  { name: "7 Wonders", players: "2–7 players", age: "Age 10+", emoji: "🏛️" },
  { name: "Dominion", players: "2–4 players", age: "Age 13+", emoji: "👑" },
  { name: "Carcassonne", players: "2–5 players", age: "Age 7+", emoji: "🗺️" },
  { name: "Terraforming Mars", players: "1–5 players", age: "Age 12+", emoji: "🔴" },
  { name: "Scythe", players: "1–5 players", age: "Age 14+", emoji: "⚙️" },
  { name: "Wingspan", players: "1–5 players", age: "Age 10+", emoji: "🦅" },
  { name: "Gloomhaven", players: "1–4 players", age: "Age 14+", emoji: "⚔️" },
  { name: "Root", players: "2–4 players", age: "Age 10+", emoji: "🦊" },
];

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (!popup) return undefined;
    const timer = setTimeout(() => setPopup(null), 2500);
    return () => clearTimeout(timer);
  }, [popup]);

  const suggestions = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return [];
    return gameDatabase.filter(
      (game) =>
        game.name.toLowerCase().includes(query) &&
        !wishlist.find((item) => item.name === game.name)
    );
  }, [searchTerm, wishlist]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addToWishlist = (game) => {
    setWishlist((prev) => [...prev, { ...game, id: Date.now() }]);
    setSearchTerm("");
    setPopup({ message: "Game added to wishlist ✔", color: "bg-emerald-500" });
  };

  const removeFromWishlist = (id) => {
    if (!window.confirm("Remove this game from your wishlist?")) return;
    setWishlist((prev) => prev.filter((game) => game.id !== id));
    setPopup({ message: "Game removed", color: "bg-red-500" });
  };

  const removeSelected = () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} game(s) from wishlist?`)) {
      return;
    }
    setWishlist((prev) => prev.filter((game) => !selectedIds.has(game.id)));
    setPopup({
      message: `${selectedIds.size} game(s) removed`,
      color: "bg-red-500",
    });
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  return (
    <div className="bg-vintage-cream text-vintage-brown font-roboto">
      {popup ? (
        <div
          className={`fixed top-24 right-6 ${popup.color} text-white px-6 py-4 rounded-xl shadow-2xl z-[60]`}
        >
          {popup.message}
        </div>
      ) : null}

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
                      No games found
                    </div>
                  ) : (
                    suggestions.map((game) => (
                      <button
                        key={game.name}
                        type="button"
                        onClick={() => addToWishlist(game)}
                        className="w-full text-left px-4 py-3 hover:bg-vintage-cream transition flex items-center gap-3"
                      >
                        <span className="text-2xl">{game.emoji}</span>
                        <div>
                          <div className="font-medium">{game.name}</div>
                          <div className="text-sm text-vintage-brown/60">
                            {game.players} · {game.age}
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

      {selectMode ? (
        <div className="fixed bottom-0 left-0 w-full bg-vintage-brown text-white py-4 shadow-lg z-40">
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <span className="font-medium">{selectedIds.size} selected</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectMode(false);
                  setSelectedIds(new Set());
                }}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-full transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={removeSelected}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full transition"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="py-20 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          {wishlist.length > 0 ? (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-playfair font-bold">
                {wishlist.length === 1 ? "1 Game" : `${wishlist.length} Games`}
              </h2>
              <button
                type="button"
                onClick={() => setSelectMode(!selectMode)}
                className="text-vintage-accent font-medium hover:text-amber-700 transition"
              >
                {selectMode ? "Cancel Selection" : "Select Multiple"}
              </button>
            </div>
          ) : null}

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
                <button
                  type="button"
                  key={game.id}
                  onClick={() =>
                    selectMode ? toggleSelection(game.id) : undefined
                  }
                  className={`bg-white rounded-2xl shadow-md border border-vintage-brown/10 p-6 transition relative text-left ${
                    selectMode
                      ? "cursor-pointer"
                      : "hover:-translate-y-2 hover:shadow-lg cursor-default"
                  } ${selectedIds.has(game.id) ? "ring-2 ring-vintage-accent" : ""}`}
                >
                  {selectMode ? (
                    <div className="absolute top-3 right-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(game.id)}
                        readOnly
                        className="w-5 h-5 accent-vintage-accent pointer-events-none"
                      />
                    </div>
                  ) : null}
                  <div className="h-40 bg-vintage-accent/20 rounded-xl mb-4 flex items-center justify-center text-4xl">
                    {game.emoji}
                  </div>
                  <h3 className="text-xl font-medium mb-1">{game.name}</h3>
                  <p className="text-sm opacity-80">
                    {game.players} · {game.age}
                  </p>
                  {!selectMode ? (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(game.id);
                      }}
                      className="mt-4 inline-block text-red-500 text-sm font-medium hover:text-red-700"
                    >
                      Remove
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WishlistPage;
