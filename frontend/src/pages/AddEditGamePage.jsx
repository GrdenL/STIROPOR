import { useEffect, useMemo, useRef, useState } from "react";
import { createListing, getMyListings, getAllGames } from "../utils/api";

const blobBaseUrl = import.meta.env.VITE_BLOB_BASE_URL;
const blobSas = import.meta.env.VITE_BLOB_SAS;

const AddEditGamePage = () => {
  // Available games from backend for autocomplete
  const [availableGames, setAvailableGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);

  // User's listings
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Form state
  const [gameName, setGameName] = useState("");
  const [condition, setCondition] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const uploadRef = useRef(null);

  // Fetch available games for autocomplete
  useEffect(() => {
    const fetchAvailableGames = async () => {
      try {
        setGamesLoading(true);
        const data = await getAllGames();
        setAvailableGames(data || []);
      } catch (err) {
        console.error("Error loading available games:", err);
        setAvailableGames([]);
      } finally {
        setGamesLoading(false);
      }
    };

    fetchAvailableGames();
  }, []);

  // Fetch user's listings
  useEffect(() => {
    let isMounted = true;

    const loadListings = async () => {
      setLoading(true);
      setLoadError("");
      const data = await getMyListings();

      if (!isMounted) return;

      if (!data) {
        setLoadError("Failed to load listings.");
        setGames([]);
        setLoading(false);
        return;
      }

      setGames(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-hide success popup
  useEffect(() => {
    if (!showPopup) return undefined;
    const timer = setTimeout(() => setShowPopup(false), 2500);
    return () => clearTimeout(timer);
  }, [showPopup]);

  // Autocomplete matches
  const matches = useMemo(() => {
    const query = gameName.toLowerCase().trim();
    if (!query) return [];

    return availableGames
      .filter((game) => game.gameName.toLowerCase().includes(query))
      .slice(0, 10); // Limit to 10 suggestions
  }, [gameName, availableGames]);

  const resetForm = () => {
    setGameName("");
    setCondition("");
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
  };

  const handleFile = (file) => {
    if (selectedImage) {
      alert("Only 1 image allowed. Remove the current image first.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert(`${file.name} is not an image file`);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage({ file, previewUrl });
  };

  const uploadImage = async (file) => {
    if (!blobBaseUrl || !blobSas) {
      throw new Error("Missing blob storage configuration.");
    }

    const safeName = `${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`;
    const uploadUrl = `${blobBaseUrl}/${safeName}?${blobSas}`;

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with ${response.status}`);
    }

    return `${blobBaseUrl}/${safeName}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = gameName.trim();
    if (!trimmedName || !condition) {
      alert("Please fill in all required fields");
      return;
    }

    // Find the game in available games to get the gameId
    const matchedGame = availableGames.find(
      (g) => g.gameName.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!matchedGame) {
      alert("Please select a valid game from the suggestions");
      return;
    }

    const payload = {
      gameId: matchedGame.gameId,
      condition,
      description: "",
    };

    if (selectedImage?.file) {
      try {
        payload.mediaHref = await uploadImage(selectedImage.file);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Image upload failed.");
        return;
      }
    }

    const created = await createListing(payload);
    if (!created) {
      alert("Failed to create listing.");
      return;
    }

    setGames((prev) => [created, ...prev]);
    resetForm();
    setShowPopup(true);
  };

  return (
    <div className="bg-vintage-cream text-vintage-brown font-roboto">
      {showPopup && (
        <div className="fixed top-24 right-6 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[100]">
          ✓ Listing created successfully!
        </div>
      )}

      <section className="bg-vintage-brown text-vintage-cream pt-32 pb-28">
        <div className="max-w-5xl mx-auto text-center px-4 translate-y-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-vintage-accent/20 flex items-center justify-center text-4xl">
            ✏️
          </div>
          <h1 className="text-4xl font-playfair font-bold mb-4">Add Game</h1>
          <p className="text-base opacity-80 max-w-xl mx-auto">
            Manage your listings
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-md border border-vintage-brown/10 p-8 sticky top-24"
              >
                <div className="mb-6 relative">
                  <label className="block text-sm font-medium mb-2">
                    Game name *
                  </label>
                  <input
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    type="text"
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-vintage-accent"
                    placeholder="e.g. Catan"
                    autoComplete="off"
                    required
                    disabled={gamesLoading}
                  />
                  {gamesLoading && (
                    <p className="text-xs text-vintage-brown/60 mt-1">
                      Loading available games...
                    </p>
                  )}
                  {matches.length > 0 && (
                    <div className="absolute w-full bg-white border border-vintage-brown/20 rounded-xl mt-1 shadow-lg max-h-64 overflow-y-auto z-[60]">
                      {matches.map((game) => (
                        <button
                          key={game.gameId}
                          type="button"
                          onClick={() => setGameName(game.gameName)}
                          className="w-full text-left px-4 py-3 hover:bg-vintage-cream transition"
                        >
                          <div className="font-medium">{game.gameName}</div>
                          <div className="text-xs text-vintage-brown/60">
                            {game.publisher} • {game.yearPublished}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Condition *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-vintage-accent"
                    required
                  >
                    <option value="">Select condition</option>
                    <option>New</option>
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Acceptable</option>
                    <option>Poor</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Add Image (1 image max)
                  </label>
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (event.dataTransfer.files.length > 0) {
                        handleFile(event.dataTransfer.files[0]);
                      }
                    }}
                    className="border-2 border-dashed border-vintage-brown/30 rounded-xl p-8 text-center transition hover:border-vintage-accent hover:bg-vintage-accent/5 cursor-pointer"
                    onClick={() => uploadRef.current?.click()}
                  >
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-vintage-brown/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-vintage-brown/60 mb-2">
                      <span className="font-medium text-vintage-accent">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-vintage-brown/40">
                      PNG, JPG up to 10MB (1 image only)
                    </p>
                  </div>
                  <input
                    ref={uploadRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      if (event.target.files.length > 0) {
                        handleFile(event.target.files[0]);
                      }
                      event.target.value = "";
                    }}
                  />
                  {selectedImage && (
                    <div className="flex gap-4 mt-4 flex-wrap">
                      <div className="relative">
                        <img
                          src={selectedImage.previewUrl}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-xl border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            URL.revokeObjectURL(selectedImage.previewUrl);
                            setSelectedImage(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-vintage-accent text-white py-3 rounded-full hover:bg-amber-700 transition"
                    disabled={gamesLoading}
                  >
                    Create Listing
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 bg-gray-300 text-vintage-brown py-3 rounded-full hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-playfair font-bold mb-2">
                  My Games
                </h2>
                <p className="text-sm text-vintage-brown/60">
                  Manage your game collection
                </p>
              </div>

              {loading ? (
                <div className="text-center py-16 text-vintage-brown/60">
                  Loading listings...
                </div>
              ) : loadError ? (
                <div className="text-center py-16 text-red-600">
                  {loadError}
                </div>
              ) : games.length === 0 ? (
                <div className="text-center py-16">
                  <svg
                    className="w-20 h-20 mx-auto mb-4 text-vintage-brown/20"
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
                  <p className="text-vintage-brown/60 font-medium text-lg mb-2">
                    No games added yet
                  </p>
                  <p className="text-sm text-vintage-brown/40">
                    Start by adding your first game using the form!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {games.map((game, index) => (
                    <div
                      key={`${game.listingId || index}`}
                      className="bg-white p-5 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition"
                    >
                      <div className="flex-1">
                        <strong className="block text-lg">
                          {game.game?.gameName ||
                            game.gameName ||
                            "Unknown Game"}
                        </strong>
                        <span className="text-sm text-vintage-brown/70">
                          {game.condition}
                        </span>
                        {game.media?.href && (
                          <span className="text-xs text-vintage-accent ml-2">
                            (1 image)
                          </span>
                        )}
                      </div>
                      {game.media?.href && (
                        <img
                          src={game.media.href}
                          alt={game.game?.gameName || "Listing"}
                          className="w-14 h-14 object-cover rounded-lg border border-vintage-brown/10"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddEditGamePage;
