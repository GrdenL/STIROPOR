import { useEffect, useMemo, useState } from "react";
import MapComponent from '../components/MapComponent';
import { useAuth } from "../context/AuthContext";
import {
  getReceivedOffers,
  getSentOffers,
  getListingById,
  acceptOffer,
  declineOffer,
  cancelOffer,
  getOfferById,
  updateOfferStatus,
} from "../utils/api";

// Status mapping: 0 = PENDING, 1 = ACCEPTED, 2 = DECLINED, 3 = CANCELLED
const statusConfig = {
  0: { className: "bg-amber-500 text-white", label: "Pending", key: "PENDING" },
  1: {
    className: "bg-emerald-500 text-white",
    label: "Accepted",
    key: "ACCEPTED",
  },
  2: { className: "bg-red-500 text-white", label: "Declined", key: "DECLINED" },
  3: {
    className: "bg-gray-500 text-white",
    label: "Cancelled",
    key: "CANCELLED",
  },
};

const MyTradesPage = () => {
  const { user, authReady } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [popup, setPopup] = useState(null);
  const [tradeType, setTradeType] = useState("received");
  const [usersById, setUsersById] = useState(null);

  useEffect(() => {
    if (!authReady) {
      return;
    }
    if (!user) {
      setLoading(false);
      setError("Please log in to view trades.");
      return;
    }
    fetchTrades();
  }, [authReady, tradeType, user]);

  const resolveStoredToken = () => {
    try {
      return sessionStorage.getItem("jwt") || localStorage.getItem("jwt");
    } catch (err) {
      return null;
    }
  };

  const loadUsersById = async () => {
    if (usersById) {
      return usersById;
    }
    const apiBase = import.meta.env.VITE_API_URL || "";
    const normalizedBase = apiBase.endsWith("/")
        ? apiBase.slice(0, -1)
        : apiBase;
    const token = resolveStoredToken();

    try {
      const res = await fetch(
          normalizedBase ? `${normalizedBase}/users` : "/users",
          {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
      );
      if (!res.ok) {
        throw new Error("Failed to load users");
      }
      const data = await res.json();
      const mappedUsers = new Map();
      data.forEach((profile) => {
        if (profile?.userId !== undefined && profile?.userId !== null) {
          mappedUsers.set(Number(profile.userId), profile);
        }
      });
      setUsersById(mappedUsers);
      return mappedUsers;
    } catch (err) {
      console.error("Failed to load users:", err);
      return null;
    }
  };

  const fetchTrades = async () => {
    setLoading(true);
    setError(null);
    try {
      let offersData;

      if (tradeType === "received") {
        offersData = await getReceivedOffers();
      } else {
        offersData = await getSentOffers();
      }

      if (!offersData) {
        throw new Error("No data returned from API");
      }

      const userDirectory = await loadUsersById();
      const currentUserId =
          user?.userId !== undefined && user?.userId !== null
              ? Number(user.userId)
              : null;

      const transformedData = await Promise.all(
          offersData.map(async (offer) => {
            try {
              const fromUserId =
                  offer?.fromUserId !== undefined && offer?.fromUserId !== null
                      ? Number(offer.fromUserId)
                      : null;
              const toUserId =
                  offer?.toUserId !== undefined && offer?.toUserId !== null
                      ? Number(offer.toUserId)
                      : null;
              const isReceived =
                  currentUserId !== null
                      ? toUserId === currentUserId
                      : tradeType === "received";
              const targetListing = offer.targetListing
                  ? offer.targetListing
                  : await getListingById(offer.targetListingId);

              const offeredListing = offer.offeredListing
                  ? offer.offeredListing
                  : offer.offeredListingIds?.length
                      ? await getListingById(offer.offeredListingIds[0])
                      : null;

              const fromName = offer.fromUsername || `User ${offer.fromUserId}`;
              const toName = offer.toUsername || `User ${offer.toUserId}`;
              const partnerUserId = isReceived ? fromUserId : toUserId;
              const yourListing = isReceived ? targetListing : offeredListing;
              const theirListing = isReceived ? offeredListing : targetListing;
              const listingPartner = [theirListing?.owner, theirListing?.user].find(
                  (candidate) =>
                      candidate &&
                      (partnerUserId === null ||
                          Number(candidate.userId) === partnerUserId)
              );
              const partnerProfile =
                  partnerUserId !== null
                      ? userDirectory?.get(partnerUserId)
                      : null;
              const partnerUser = partnerProfile || listingPartner;
              const partnerName =
                  partnerUser?.username || (isReceived ? fromName : toName);
              const statusValue =
                  offer.status !== undefined ? offer.status : offer.offerStatus;
              const normalizedStatus = Number.isInteger(statusValue)
                  ? statusValue
                  : 0;
              const partnerEmailName = (partnerName || "")
                  .toLowerCase()
                  .replace(/\s+/g, ".");
              const partnerAvatar = partnerUser?.avatarUrl;
              const partnerTown = partnerUser?.town?.townName;
              const partnerCountry = partnerUser?.town?.country?.countryName;
              const partnerLocation =
                  partnerUser?.location ||
                  [partnerTown, partnerCountry].filter(Boolean).join(", ") ||
                  "Unknown";

              return {
                id: offer.id || offer.offerId,
                partnerAvatar: partnerAvatar,
                partnerInitials: getInitials(partnerName),
                from: isReceived ? fromName : "You",
                to: isReceived ? "You" : toName,
                yourGame:
                    yourListing?.game?.gameName ||
                    yourListing?.game?.name ||
                    yourListing?.gameName ||
                    "Unknown Game",
                yourCondition: formatCondition(yourListing?.condition),
                theirGame:
                    theirListing?.game?.gameName ||
                    theirListing?.game?.name ||
                    theirListing?.gameName ||
                    "Unknown Game",
                theirCondition: formatCondition(theirListing?.condition),
                status: normalizedStatus,
                date: formatDate(offer.createdAt),
                partnerEmail:
                    partnerUser?.email ||
                    (partnerEmailName
                        ? `${partnerEmailName}@example.com`
                        : "unknown@example.com"),
                partnerBio: partnerUser?.description,
                location: partnerLocation,
                latitude: partnerUser?.latitude || null,
                longitude: partnerUser?.longitude || null,
                distance: calculateDistance(partnerLocation),
                targetListingId: offer.targetListingId,
                offeredListingIds: offer.offeredListingIds,
                fromUserId: offer.fromUserId,
                toUserId: offer.toUserId,
                message: offer.message || "No message provided",
                isReceived: isReceived,
                partnerName: partnerName,
              };
            } catch (error) {
              console.error(
                  `Error processing offer ${offer.id || offer.offerId}:`,
                  error
              );
              return null;
            }
          })
      );

      setTrades(transformedData.filter((trade) => trade !== null));
    } catch (err) {
      console.error("Failed to fetch trades:", err);
      setError("Failed to load trades. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
  };

  const formatCondition = (condition) => {
    const conditionMap = {
      LIKE_NEW: "Like New",
      VERY_GOOD: "Very Good",
      GOOD: "Good",
      ACCEPTABLE: "Acceptable",
    };
    return conditionMap[condition] || condition || "Unknown";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const calculateDistance = (location) => {
    if (!location) return "Unknown distance";
    const distances = ["3 km", "5 km", "7 km", "8 km", "12 km", "15 km"];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  const filteredTrades = useMemo(() => {
    let filtered = trades;

    if (filter !== "all") {
      filtered = trades.filter((trade) => trade.status === filter);
    }

    return filtered;
  }, [filter, trades]);

  useEffect(() => {
    if (!popup) return undefined;
    const timer = setTimeout(() => setPopup(null), 2500);
    return () => clearTimeout(timer);
  }, [popup]);

  const handleAcceptOffer = async (offerId) => {
    try {
      await acceptOffer(offerId);
      fetchTrades();
      setPopup({
        message: "Trade accepted successfully!",
        color: "bg-emerald-500",
      });
      if (selectedTrade?.id === offerId) {
        setSelectedTrade(null);
      }
    } catch (err) {
      console.error("Failed to accept offer:", err);
      setPopup({
        message: "Failed to accept trade. Please try again.",
        color: "bg-red-500",
      });
    }
  };

  const handleDeclineOffer = async (offerId) => {
    try {
      await declineOffer(offerId);
      fetchTrades();
      setPopup({
        message: "Trade declined successfully!",
        color: "bg-red-500",
      });
      if (selectedTrade?.id === offerId) {
        setSelectedTrade(null);
      }
    } catch (err) {
      console.error("Failed to decline offer:", err);
      setPopup({
        message: "Failed to decline trade. Please try again.",
        color: "bg-red-500",
      });
    }
  };

  const handleCancelOffer = async (offerId) => {
    try {
      await cancelOffer(offerId);
      fetchTrades();
      setPopup({
        message: "Trade cancelled successfully!",
        color: "bg-gray-500",
      });
      if (selectedTrade?.id === offerId) {
        setSelectedTrade(null);
      }
    } catch (err) {
      console.error("Failed to cancel offer:", err);
      setPopup({
        message: "Failed to cancel trade. Please try again.",
        color: "bg-red-500",
      });
    }
  };

  const handleUpdateOfferStatus = async (offerId, status) => {
    try {
      await updateOfferStatus(offerId, status);
      fetchTrades();
      setPopup({
        message: "Trade status updated successfully!",
        color: "bg-emerald-500",
      });
    } catch (err) {
      console.error("Failed to update offer status:", err);
      setPopup({
        message: "Failed to update trade status. Please try again.",
        color: "bg-red-500",
      });
    }
  };

  const handleViewTradeDetails = async (tradeId) => {
    try {
      const offerDetails = await getOfferById(tradeId);
      const trade = trades.find((t) => t.id === tradeId);
      if (trade) {
        setSelectedTrade({
          ...trade,
          details: offerDetails,
        });
      }
    } catch (err) {
      console.error("Failed to fetch trade details:", err);
      setPopup({
        message: "Failed to load trade details. Please try again.",
        color: "bg-red-500",
      });
    }
  };

  if (loading) {
    return (
        <div className="bg-vintage-cream min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-vintage-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-vintage-brown">Loading trades...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-vintage-cream min-h-screen flex items-center justify-center">
          <div className="text-center">
            <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-vintage-brown mb-4">{error}</p>
            <button
                onClick={fetchTrades}
                className="bg-vintage-accent text-white px-6 py-2 rounded-full hover:bg-amber-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
    );
  }

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
              🔄
            </div>
            <h1 className="text-4xl font-playfair font-bold mb-4">My Trades</h1>
            <p className="text-base opacity-80 max-w-xl mx-auto">
              Current and past trade offers
            </p>
          </div>
        </section>

        <section className="py-12 border-b border-vintage-brown/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 mb-4">
                <button
                    type="button"
                    onClick={() => setTradeType("received")}
                    className={`py-2 px-6 rounded-full transition border-2 ${
                        tradeType === "received"
                            ? "bg-vintage-accent text-white border-vintage-accent"
                            : "border-vintage-accent text-vintage-accent hover:bg-vintage-accent hover:text-white"
                    }`}
                >
                  Received Offers
                </button>
                <button
                    type="button"
                    onClick={() => setTradeType("sent")}
                    className={`py-2 px-6 rounded-full transition border-2 ${
                        tradeType === "sent"
                            ? "bg-vintage-accent text-white border-vintage-accent"
                            : "border-vintage-accent text-vintage-accent hover:bg-vintage-accent hover:text-white"
                    }`}
                >
                  Sent Offers
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {["all", 0, 1, 2, 3].map((key) => {
                  const isActive = filter === key;
                  const config =
                      typeof key === "number" ? statusConfig[key] : null;
                  const displayLabel =
                      key === "all" ? "All Trades" : config?.label || key;

                  return (
                      <button
                          key={key}
                          type="button"
                          onClick={() => setFilter(key)}
                          className={`py-2 px-6 rounded-full transition border-2 ${
                              isActive
                                  ? key === 0
                                      ? "bg-amber-500 text-white border-amber-500"
                                      : key === 1
                                          ? "bg-emerald-500 text-white border-emerald-500"
                                          : key === 2
                                              ? "bg-red-500 text-white border-red-500"
                                              : key === 3
                                                  ? "bg-gray-500 text-white border-gray-500"
                                                  : "bg-vintage-accent text-white border-vintage-accent"
                                  : key === 0
                                      ? "border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                                      : key === 1
                                          ? "border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                          : key === 2
                                              ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                              : key === 3
                                                  ? "border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                                                  : "border-vintage-accent text-vintage-accent hover:bg-vintage-accent hover:text-white"
                          }`}
                      >
                        {displayLabel}
                      </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-playfair font-bold">
                {filteredTrades.length} Trade
                {filteredTrades.length !== 1 ? "s" : ""} (
                {tradeType === "received" ? "Received" : "Sent"})
              </h2>
            </div>

            {filteredTrades.length === 0 ? (
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
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <p className="text-vintage-brown/40 text-lg">No trades found</p>
                  <p className="text-sm text-vintage-brown/30 mt-1">
                    {tradeType === "received"
                        ? "You haven't received any trade offers yet."
                        : "You haven't sent any trade offers yet."}
                  </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTrades.map((trade) => {
                    const status = statusConfig[trade.status];
                    const isReceived = trade.isReceived;

                    return (
                        <div
                            key={trade.id}
                            className="bg-white rounded-2xl shadow-md border border-vintage-brown/10 p-6 transition hover:-translate-y-2 hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-vintage-accent/20 flex items-center justify-center text-vintage-accent font-bold text-sm">
                                {trade.partnerAvatar ? (
                                    <img
                                        src={trade.partnerAvatar}
                                        alt={trade.partnerName}
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = ""; // Fallback to initials if image fails
                                          e.target.parentElement.innerText = trade.partnerInitials;
                                        }}
                                    />
                                ) : (
                                    trade.partnerInitials
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {isReceived ? trade.from : "You"} →{" "}
                                  {isReceived ? "You" : trade.to}
                                </p>
                                <p className="text-xs text-vintage-brown/60">
                                  {trade.date}
                                </p>
                              </div>
                            </div>
                            <span
                                className={`text-xs px-3 py-1 rounded-full ${status.className}`}
                            >
                        {status.label}
                      </span>
                          </div>

                          <div className="bg-vintage-cream/50 rounded-xl p-4 mb-4">
                            <p className="text-sm mb-2">
                        <span className="text-vintage-brown/60">
                          {isReceived ? "They want your:" : "You want their:"}
                        </span>{" "}
                              <span className="font-medium">{trade.yourGame}</span>
                            </p>
                            <div className="border-t border-vintage-brown/10 my-2" />
                            <p className="text-sm">
                        <span className="text-vintage-brown/60">
                          {isReceived ? "They offer:" : "You offer:"}
                        </span>{" "}
                              <span className="font-medium">{trade.theirGame}</span>
                            </p>
                            <p className="text-xs text-vintage-brown/50 mt-1">
                              Condition: {trade.theirCondition}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleViewTradeDetails(trade.id)}
                                className="view-details flex-1 bg-vintage-accent text-white py-2 rounded-full hover:bg-amber-700 transition text-sm"
                            >
                              View Details
                            </button>

                            {trade.status === 0 &&
                                (isReceived ? (
                                    <>
                                      <button
                                          type="button"
                                          onClick={() => {
                                            if (
                                                window.confirm(
                                                    `Accept trade with ${trade.from}?`
                                                )
                                            ) {
                                              handleAcceptOffer(trade.id);
                                            }
                                          }}
                                          className="px-4 border border-emerald-500 text-emerald-500 rounded-full hover:bg-emerald-500 hover:text-white transition text-sm"
                                      >
                                        ✓
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => {
                                            if (
                                                window.confirm(
                                                    `Decline trade with ${trade.from}?`
                                                )
                                            ) {
                                              handleDeclineOffer(trade.id);
                                            }
                                          }}
                                          className="px-4 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition text-sm"
                                      >
                                        ✕
                                      </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                          if (window.confirm("Cancel your trade offer?")) {
                                            handleCancelOffer(trade.id);
                                          }
                                        }}
                                        className="px-4 border border-gray-500 text-gray-500 rounded-full hover:bg-gray-500 hover:text-white transition text-sm"
                                    >
                                      Cancel
                                    </button>
                                ))}
                          </div>
                        </div>
                    );
                  })}
                </div>
            )}
          </div>
        </section>

        {selectedTrade ? (
            <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-vintage-brown/10 p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-playfair font-bold">
                    Trade Details
                  </h2>
                  <button
                      type="button"
                      onClick={() => setSelectedTrade(null)}
                      className="text-vintage-brown/60 hover:text-vintage-brown"
                  >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-medium mb-1">
                        {selectedTrade.theirGame}
                      </h3>
                      <span
                          className={`text-xs px-3 py-1 rounded-full ${
                              statusConfig[selectedTrade.status].className
                          }`}
                      >
                    {statusConfig[selectedTrade.status].label}
                  </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-vintage-brown/60">Trade Partner</p>
                      <p className="font-medium">
                        {selectedTrade.partnerName ||
                            (selectedTrade.isReceived
                                ? selectedTrade.from
                                : selectedTrade.to)}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-vintage-cream/50 rounded-xl p-4">
                      <p className="text-sm font-medium text-vintage-brown/60 mb-3">
                        {selectedTrade.isReceived
                            ? "They want your:"
                            : "You want their:"}
                      </p>
                      <h4 className="text-lg font-medium mb-2">
                        {selectedTrade.yourGame}
                      </h4>
                      <p className="text-xs text-vintage-brown/60">
                        Condition:{" "}
                        <span className="font-medium">
                      {selectedTrade.yourCondition}
                    </span>
                      </p>
                    </div>
                    <div className="bg-vintage-accent/10 rounded-xl p-4">
                      <p className="text-sm font-medium text-vintage-brown/60 mb-3">
                        {selectedTrade.isReceived ? "You receive:" : "You offer:"}
                      </p>
                      <h4 className="text-lg font-medium mb-2">
                        {selectedTrade.theirGame}
                      </h4>
                      <p className="text-xs text-vintage-brown/60">
                        Condition:{" "}
                        <span className="font-medium">
                      {selectedTrade.theirCondition}
                    </span>
                      </p>
                    </div>
                  </div>

                  {selectedTrade.message && (
                      <div className="bg-white border border-vintage-brown/10 rounded-xl p-4 mb-6">
                        <p className="text-sm font-medium text-vintage-brown/60 mb-2">
                          {selectedTrade.isReceived
                              ? "Message from trader:"
                              : "Your message:"}
                        </p>
                        <p className="text-sm text-vintage-brown/70">
                          {selectedTrade.message}
                        </p>
                      </div>
                  )}

                  <div className="bg-white border border-vintage-brown/10 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <svg
                          className="w-5 h-5 text-vintage-accent mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">Partner Location</p>
                        <p className="text-sm text-vintage-brown/70">
                          {selectedTrade.location}
                        </p>
                        <p className="text-xs text-vintage-brown/50 mt-1">
                          ~{selectedTrade.distance} from you
                        </p>
                      </div>
                    </div>

                    {/* OpenStreetMap Component */}
                    <MapComponent
                        latitude={selectedTrade.latitude}
                        longitude={selectedTrade.longitude}
                        location={selectedTrade.location}
                        partnerName={selectedTrade.partnerName}
                    />
                  </div>

                  <div className="bg-white border border-vintage-brown/10 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-vintage-accent/20 flex items-center justify-center text-vintage-accent font-bold">
                        {selectedTrade.partnerAvatar ? (
                            <img
                                src={selectedTrade.partnerAvatar}
                                alt={selectedTrade.partnerName}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "";
                                  e.target.parentElement.innerText =
                                      selectedTrade.partnerInitials;
                                }}
                            />
                        ) : (
                            selectedTrade.partnerInitials
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {selectedTrade.partnerName ||
                              (selectedTrade.isReceived
                                  ? selectedTrade.from
                                  : selectedTrade.to)}
                        </p>
                        <a
                            href={`mailto:${selectedTrade.partnerEmail}`}
                            className="text-sm text-vintage-accent hover:text-amber-700 flex items-center gap-1 mt-1"
                        >
                          <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{selectedTrade.partnerEmail}</span>
                        </a>
                        <p className="text-sm text-vintage-brown/60 mt-1">
                          {selectedTrade.partnerBio}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-vintage-cream/30 rounded-xl p-4 mb-6 text-center">
                    <p className="text-sm text-vintage-brown/60">Status</p>
                    <p
                        className={`text-lg font-medium mt-1 ${
                            selectedTrade.status === 0
                                ? "text-amber-500"
                                : selectedTrade.status === 1
                                    ? "text-emerald-500"
                                    : selectedTrade.status === 2
                                        ? "text-red-500"
                                        : "text-gray-500"
                        }`}
                    >
                      {selectedTrade.status === 0
                          ? selectedTrade.isReceived
                              ? "Pending your response"
                              : "Waiting for response"
                          : selectedTrade.status === 1
                              ? "Trade accepted"
                              : selectedTrade.status === 2
                                  ? "Trade declined"
                                  : "Trade cancelled"}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {selectedTrade.status === 0 && selectedTrade.isReceived ? (
                        <>
                          <button
                              type="button"
                              onClick={() => {
                                if (
                                    window.confirm(
                                        `Accept trade with ${selectedTrade.from}?`
                                    )
                                ) {
                                  handleAcceptOffer(selectedTrade.id);
                                  setSelectedTrade(null);
                                }
                              }}
                              className="flex-1 bg-emerald-500 text-white py-3 rounded-full hover:bg-emerald-600 transition"
                          >
                            Accept Trade
                          </button>
                          <button
                              type="button"
                              onClick={() => {
                                if (
                                    window.confirm(
                                        `Decline trade with ${selectedTrade.from}?`
                                    )
                                ) {
                                  handleDeclineOffer(selectedTrade.id);
                                  setSelectedTrade(null);
                                }
                              }}
                              className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-full hover:bg-red-500 hover:text-white transition"
                          >
                            Decline Trade
                          </button>
                        </>
                    ) : selectedTrade.status === 0 && !selectedTrade.isReceived ? (
                        <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Cancel your trade offer?")) {
                                handleCancelOffer(selectedTrade.id);
                                setSelectedTrade(null);
                              }
                            }}
                            className="w-full border-2 border-gray-500 text-gray-500 py-3 rounded-full hover:bg-gray-500 hover:text-white transition"
                        >
                          Cancel Trade Offer
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setSelectedTrade(null)}
                            className="w-full bg-vintage-accent text-white py-3 rounded-full hover:bg-amber-700 transition"
                        >
                          Close
                        </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
        ) : null}
      </div>
  );
};

export default MyTradesPage;
