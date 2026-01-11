import { useEffect, useMemo, useState } from "react";

const mockTrades = [
  {
    id: 1,
    from: "Marko P.",
    fromInitials: "MP",
    yourGame: "Catan",
    yourCondition: "Good",
    theirGame: "Ticket to Ride",
    theirCondition: "Good",
    status: "pending",
    date: "2 hours ago",
    partnerEmail: "marko.p@example.com",
    partnerBio: "Board game enthusiast",
    location: "Zagreb, Croatia",
    distance: "5 km",
  },
  {
    id: 2,
    from: "Ana K.",
    fromInitials: "AK",
    yourGame: "Dominion",
    yourCondition: "Like New",
    theirGame: "7 Wonders",
    theirCondition: "Like New",
    status: "accepted",
    date: "1 day ago",
    partnerEmail: "ana.k@example.com",
    partnerBio: "Strategy game collector",
    location: "Split, Croatia",
    distance: "12 km",
  },
  {
    id: 3,
    from: "Ivan M.",
    fromInitials: "IM",
    yourGame: "Pandemic",
    yourCondition: "Good",
    theirGame: "Azul",
    theirCondition: "Good",
    status: "pending",
    date: "3 hours ago",
    partnerEmail: "ivan.m@example.com",
    partnerBio: "Casual gamer",
    location: "Rijeka, Croatia",
    distance: "8 km",
  },
  {
    id: 4,
    from: "Petra S.",
    fromInitials: "PS",
    yourGame: "Splendor",
    yourCondition: "Very Good",
    theirGame: "Wingspan",
    theirCondition: "Very Good",
    status: "declined",
    date: "2 days ago",
    partnerEmail: "petra.s@example.com",
    partnerBio: "Nature game lover",
    location: "Osijek, Croatia",
    distance: "15 km",
  },
  {
    id: 5,
    from: "Luka B.",
    fromInitials: "LB",
    yourGame: "Carcassonne",
    yourCondition: "Like New",
    theirGame: "Root",
    theirCondition: "Like New",
    status: "pending",
    date: "5 hours ago",
    partnerEmail: "luka.b@example.com",
    partnerBio: "Complex game enthusiast",
    location: "Zagreb, Croatia",
    distance: "3 km",
  },
  {
    id: 6,
    from: "Sara T.",
    fromInitials: "ST",
    yourGame: "Codenames",
    yourCondition: "Good",
    theirGame: "Dixit",
    theirCondition: "Very Good",
    status: "accepted",
    date: "3 days ago",
    partnerEmail: "sara.t@example.com",
    partnerBio: "Party game fan",
    location: "Zagreb, Croatia",
    distance: "7 km",
  },
];

const statusConfig = {
  pending: { className: "bg-amber-500 text-white", label: "Pending" },
  accepted: { className: "bg-emerald-500 text-white", label: "Accepted" },
  declined: { className: "bg-red-500 text-white", label: "Declined" },
};

const MyTradesPage = () => {
  const [trades, setTrades] = useState(mockTrades);
  const [filter, setFilter] = useState("all");
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [popup, setPopup] = useState(null);

  const filteredTrades = useMemo(() => {
    if (filter === "all") return trades;
    return trades.filter((trade) => trade.status === filter);
  }, [filter, trades]);

  useEffect(() => {
    if (!popup) return undefined;
    const timer = setTimeout(() => setPopup(null), 2500);
    return () => clearTimeout(timer);
  }, [popup]);

  const updateTradeStatus = (id, status) => {
    setTrades((prev) =>
      prev.map((trade) => (trade.id === id ? { ...trade, status } : trade))
    );
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
          <div className="flex flex-wrap gap-3">
            {["all", "pending", "accepted", "declined"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`py-2 px-6 rounded-full transition border-2 ${
                  filter === key
                    ? key === "pending"
                      ? "bg-amber-500 text-white border-amber-500"
                      : key === "accepted"
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : key === "declined"
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-vintage-accent text-white border-vintage-accent"
                    : key === "pending"
                    ? "border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                    : key === "accepted"
                    ? "border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                    : key === "declined"
                    ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    : "border-vintage-accent text-vintage-accent hover:bg-vintage-accent hover:text-white"
                }`}
              >
                {key === "all"
                  ? "All Trades"
                  : `${key[0].toUpperCase()}${key.slice(1)}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-playfair font-bold">
              {filteredTrades.length} Trades
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
                Try adjusting your filters!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrades.map((trade) => {
                const status = statusConfig[trade.status];
                return (
                  <div
                    key={trade.id}
                    className="bg-white rounded-2xl shadow-md border border-vintage-brown/10 p-6 transition hover:-translate-y-2 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-vintage-accent/20 flex items-center justify-center text-vintage-accent font-bold text-sm">
                          {trade.fromInitials}
                        </div>
                        <div>
                          <p className="font-medium">{trade.from}</p>
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
                        <span className="text-vintage-brown/60">For your:</span>{" "}
                        <span className="font-medium">{trade.yourGame}</span>
                      </p>
                      <div className="border-t border-vintage-brown/10 my-2" />
                      <p className="text-sm">
                        <span className="text-vintage-brown/60">
                          They offer:
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
                        onClick={() => setSelectedTrade(trade)}
                        className="view-details flex-1 bg-vintage-accent text-white py-2 rounded-full hover:bg-amber-700 transition text-sm"
                      >
                        View Details
                      </button>
                      {trade.status === "pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Accept trade with ${trade.from}?`)) {
                                updateTradeStatus(trade.id, "accepted");
                                setPopup({
                                  message: "Trade accepted ✔",
                                  color: "bg-emerald-500",
                                });
                              }
                            }}
                            className="px-4 border border-emerald-500 text-emerald-500 rounded-full hover:bg-emerald-500 hover:text-white transition text-sm"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Decline trade with ${trade.from}?`)) {
                                updateTradeStatus(trade.id, "declined");
                                setPopup({
                                  message: "Trade declined",
                                  color: "bg-red-500",
                                });
                              }
                            }}
                            className="px-4 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition text-sm"
                          >
                            ✕
                          </button>
                        </>
                      ) : null}
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
              <h2 className="text-2xl font-playfair font-bold">Trade Details</h2>
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
                  <p className="text-sm text-vintage-brown/60">
                    Trade Partner
                  </p>
                  <p className="font-medium">{selectedTrade.from}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-vintage-cream/50 rounded-xl p-4">
                  <p className="text-sm font-medium text-vintage-brown/60 mb-3">
                    They are Receiving
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
                    You are Receiving
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

              <div className="bg-white border border-vintage-brown/10 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
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
              </div>

              <div className="bg-white border border-vintage-brown/10 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-vintage-accent/20 flex items-center justify-center text-vintage-accent font-bold">
                    {selectedTrade.fromInitials}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedTrade.from}</p>
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
                    selectedTrade.status === "pending"
                      ? "text-amber-500"
                      : selectedTrade.status === "accepted"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedTrade.status === "pending"
                    ? "Pending your response"
                    : selectedTrade.status === "accepted"
                    ? "Trade accepted"
                    : "Trade declined"}
                </p>
              </div>

              <div className="flex gap-3">
                {selectedTrade.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Accept trade with ${selectedTrade.from}?`)) {
                          updateTradeStatus(selectedTrade.id, "accepted");
                          setPopup({
                            message: "Trade accepted ✔",
                            color: "bg-emerald-500",
                          });
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
                        if (window.confirm(`Decline trade with ${selectedTrade.from}?`)) {
                          updateTradeStatus(selectedTrade.id, "declined");
                          setPopup({
                            message: "Trade declined",
                            color: "bg-red-500",
                          });
                          setSelectedTrade(null);
                        }
                      }}
                      className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-full hover:bg-red-500 hover:text-white transition"
                    >
                      Decline Trade
                    </button>
                  </>
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
