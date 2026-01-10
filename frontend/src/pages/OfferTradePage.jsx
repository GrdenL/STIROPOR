import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { mockListings } from "../data/mockListings";
import logo from "../assets/logo.png";

// privremeno: mock "moji listingi"
const MOCK_LOGGED_USER_ID = 1;

const OfferTradePage = () => {
  const { listingId } = useParams();
  const targetListingId = Number(listingId);

  const targetListing = mockListings.find(
    (l) => l.listingId === targetListingId
  );

  const myListings = mockListings.filter(
    (l) => l.owner.userId === MOCK_LOGGED_USER_ID && l.isActive
  );

  const [selectedListings, setSelectedListings] = useState([]);
  const [message, setMessage] = useState("");

  if (!targetListing) {
    return (
      <p className="text-center mt-10 text-vintage-brown">
        Listing not found.
      </p>
    );
  }

  const toggleListing = (id) => {
    setSelectedListings((prev) =>
      prev.includes(id)
        ? prev.filter((l) => l !== id)
        : [...prev, id]
    );
  };

  const submitOffer = () => {
    const payload = {
      target_listingId: targetListingId,
      offeredListings: selectedListings,
      message,
    };

    console.log("OFFER PAYLOAD:", payload);
    alert("Offer sent (mock)");
  };

  return (
    <div className="bg-vintage-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          to={`/games/${targetListing.gameId}`}
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
              {targetListing.gameName}
            </h2>
            <p>
              Owner: <strong>{targetListing.owner.username}</strong>
            </p>
            <p>
              {targetListing.owner.town},{" "}
              {targetListing.owner.country}
            </p>
            <p className="italic">
              Condition: {targetListing.condition}
            </p>
          </div>
        </div>

        {/* MY LISTINGS */}
        <div>
          <h3 className="text-lg font-semibold text-vintage-brown mb-4">
            Select your games to offer
          </h3>

          {myListings.length === 0 ? (
            <p className="text-vintage-brown/70">
              You have no active listings.
            </p>
          ) : (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <label
                  key={listing.listingId}
                  className="flex items-center gap-4 border rounded-lg p-4 bg-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedListings.includes(
                      listing.listingId
                    )}
                    onChange={() =>
                      toggleListing(listing.listingId)
                    }
                  />

                  <img
                    src={listing.media?.href || logo}
                    onError={(e) => (e.target.src = logo)}
                    alt=""
                    className="h-16 w-16 object-cover rounded"
                  />

                  <div className="text-sm text-vintage-brown">
                    <p className="font-semibold">
                      {listing.gameName}
                    </p>
                    <p className="italic">
                      Condition: {listing.condition}
                    </p>
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
            className="w-full border rounded-lg p-3"
            placeholder="Write a message to the other user..."
          />
        </div>

        {/* SUBMIT */}
        <button
          disabled={selectedListings.length === 0}
          onClick={submitOffer}
          className={`px-8 py-3 rounded-full text-white font-medium transition
            ${
              selectedListings.length > 0
                ? "bg-vintage-accent hover:bg-amber-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Send offer
        </button>
      </div>
    </div>
  );
};

export default OfferTradePage;
