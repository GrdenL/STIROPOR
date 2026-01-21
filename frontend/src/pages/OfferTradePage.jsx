import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getListingById, getMyListings, createOffer } from "../utils/api";
import logo from "../assets/logo.png";

const OfferTradePage = () => {
  const { listingId } = useParams();
  const targetListingId = Number(listingId);

  // Target listing state
  const [targetListing, setTargetListing] = useState(null);
  const [targetLoading, setTargetLoading] = useState(true);

  // My listings state
  const [myListings, setMyListings] = useState([]);
  const [myListingsLoading, setMyListingsLoading] = useState(true);

  // Form state
  const [selectedListings, setSelectedListings] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch target listing
  useEffect(() => {
    const fetchTargetListing = async () => {
      try {
        setTargetLoading(true);
        const data = await getListingById(targetListingId);
        setTargetListing(data);
      } catch (err) {
        console.error("Error loading target listing:", err);
        setTargetListing(null);
      } finally {
        setTargetLoading(false);
      }
    };

    fetchTargetListing();
  }, [targetListingId]);

  // Fetch my listings
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setMyListingsLoading(true);
        const data = await getMyListings();
        // Filter only active listings
        setMyListings(data?.filter((l) => l.isActive !== false) || []);
      } catch (err) {
        console.error("Error loading my listings:", err);
        setMyListings([]);
      } finally {
        setMyListingsLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  const toggleListing = (id) => {
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  };

  const submitOffer = async () => {
    if (selectedListings.length === 0) {
      alert("Please select at least one game to offer");
      return;
    }

    const payload = {
      requestedListingId: targetListingId,
      offeredListingIds: selectedListings,
      message: message.trim() || null,
    };

    try {
      setSubmitting(true);
      const result = await createOffer(payload);

      if (result) {
        alert("Offer sent successfully!");
        // Optionally redirect back to game details
        window.history.back();
      } else {
        alert("Failed to send offer. Please try again.");
      }
    } catch (err) {
      console.error("Error sending offer:", err);
      alert("Failed to send offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (targetLoading) {
    return (
      <div className="bg-vintage-cream min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-vintage-brown text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!targetListing) {
    return (
      <div className="bg-vintage-cream min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-vintage-brown">Listing not found.</p>
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

  return (
    <div className="bg-vintage-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          to={`/games/${targetListing.game?.gameId || targetListing.gameId}`}
          className="text-sm text-vintage-accent hover:underline"
        >
          ← Back to game
        </Link>

        {/* TARGET LISTING */}
        <div className="bg-white rounded-xl shadow p-6 flex gap-6">
          <img
            src={targetListing.media?.href || logo}
            onError={(e) => (e.target.src = logo)}
            alt="Target listing"
            className="h-32 w-32 object-cover rounded-lg"
          />

          <div className="text-vintage-brown space-y-1">
            <h2 className="text-xl font-semibold">
              {targetListing.game?.gameName || targetListing.gameName}
            </h2>
            <p>
              Owner:{" "}
              <strong>
                {targetListing.owner?.username || targetListing.user?.username}
              </strong>
            </p>
            <p>
              {targetListing.owner?.town?.townName ||
                targetListing.user?.town?.townName ||
                "Unknown"}
              ,{" "}
              {targetListing.owner?.town?.country?.countryName ||
                targetListing.user?.town?.country?.countryName ||
                "Unknown"}
            </p>
            <p className="italic">Condition: {targetListing.condition}</p>
          </div>
        </div>

        {/* MY LISTINGS */}
        <div>
          <h3 className="text-lg font-semibold text-vintage-brown mb-4">
            Select your games to offer
          </h3>

          {myListingsLoading ? (
            <p className="text-vintage-brown/70">Loading your listings...</p>
          ) : myListings.length === 0 ? (
            <div className="text-vintage-brown/70">
              <p className="mb-2">You have no active listings.</p>
              <Link
                to="/add-game"
                className="text-vintage-accent hover:underline"
              >
                Add a game to your collection →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <label
                  key={listing.listingId}
                  className="flex items-center gap-4 border rounded-lg p-4 bg-white cursor-pointer hover:border-vintage-accent transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedListings.includes(listing.listingId)}
                    onChange={() => toggleListing(listing.listingId)}
                    className="w-5 h-5"
                  />

                  <img
                    src={listing.mediaHref || listing.media?.href || logo}
                    onError={(e) => (e.target.src = logo)}
                    alt=""
                    className="h-16 w-16 object-cover rounded"
                  />

                  <div className="text-sm text-vintage-brown">
                    <p className="font-semibold">
                      {listing.game?.gameName || listing.gameName}
                    </p>
                    <p className="italic">Condition: {listing.condition}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* MESSAGE */}
        <div>
          <label className="block text-sm font-medium text-vintage-brown mb-2">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-vintage-accent"
            placeholder="Write a message to the other user..."
          />
        </div>

        {/* SUBMIT */}
        <button
          disabled={selectedListings.length === 0 || submitting}
          onClick={submitOffer}
          className={`px-8 py-3 rounded-full text-white font-medium transition
            ${
              selectedListings.length > 0 && !submitting
                ? "bg-vintage-accent hover:bg-amber-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          {submitting ? "Sending..." : "Send offer"}
        </button>
      </div>
    </div>
  );
};

export default OfferTradePage;
