

export const mockListings = [

  {
    listingId: 1,
    condition: "Very good",
    isActive: true,
    created_at: "2025-01-10",
    description: "Played only a few times, all components complete.",

    media: {
      href: "/images/listings/catan-listing.jpg",
    },

    game: {
      gameId: 1,
      gameName: "Catan",
      publisher: "Kosmos",
      yearPublished: 1995,
      maxMinPlayers: "3–4",
      avgPlayTime: 90,
      complexity: 2,
      media: {
        href: "/images/games/catan.jpg",
      },
      genres: [
        { genreId: 1, genreName: "Strategy" },
        { genreId: 2, genreName: "Family" },
      ],
    },

    owner: {
      userId: 1,
      username: "markoZG",
      town: "Zagreb",
      country: "Croatia",
    },
  },

  {
    listingId: 2,
    condition: "Good",
    isActive: true,
    created_at: "2025-01-12",
    description: "Box slightly worn, cards sleeved.",

    media: {
      href: "/images/listings/carcassonne-listing.jpg",
    },

    game: {
      gameId: 2,
      gameName: "Carcassonne",
      publisher: "Hans im Glück",
      yearPublished: 2000,
      maxMinPlayers: "2–5",
      avgPlayTime: 45,
      complexity: 1,
      media: {
        href: "/images/games/carcassonne.jpg",
      },
      genres: [
        { genreId: 2, genreName: "Family" },
        { genreId: 3, genreName: "Tile Placement" },
      ],
    },

    owner: {
      userId: 2,
      username: "anaST",
      town: "Split",
      country: "Croatia",
    },
  },

  {
    listingId: 3,
    condition: "Like new",
    isActive: true,
    created_at: "2025-01-15",
    description: "Received as a gift, never played.",

    media: {
      href: "/images/listings/gloomhaven-listing.jpg",
    },

    game: {
      gameId: 3,
      gameName: "Gloomhaven",
      publisher: "Cephalofair Games",
      yearPublished: 2017,
      maxMinPlayers: "1–4",
      avgPlayTime: 120,
      complexity: 4,
      media: {
        href: "/images/games/gloomhaven.jpg",
      },
      genres: [
        { genreId: 1, genreName: "Strategy" },
        { genreId: 4, genreName: "Adventure" },
        { genreId: 5, genreName: "Cooperative" },
      ],
    },

    owner: {
      userId: 3,
      username: "ivanRI",
      town: "Rijeka",
      country: "Croatia",
    },
  },

  {
    listingId: 4,
    condition: "Acceptable",
    isActive: true,
    created_at: "2025-01-18",
    description: "Older edition, fully playable.",

    media: {
      href: "/images/listings/ticket-listing.jpg",
    },

    game: {
      gameId: 4,
      gameName: "Ticket to Ride",
      publisher: "Days of Wonder",
      yearPublished: 2004,
      maxMinPlayers: "2–5",
      avgPlayTime: 60,
      complexity: 1,
      media: {
        href: "/images/games/ticket.jpg",
      },
      genres: [
        { genreId: 2, genreName: "Family" },
        { genreId: 6, genreName: "Route Building" },
      ],
    },

    owner: {
      userId: 4,
      username: "lukaOS",
      town: "Osijek",
      country: "Croatia",
    },
  },

  {
    listingId: 5,
    condition: "Very good",
    isActive: true,
    created_at: "2025-01-20",
    description: "Includes wooden insert.",

    media: {
      href: "/images/listings/terraforming-listing.jpg",
    },

    game: {
      gameId: 5,
      gameName: "Terraforming Mars",
      publisher: "FryxGames",
      yearPublished: 2016,
      maxMinPlayers: "1–5",
      avgPlayTime: 120,
      complexity: 3,
      media: {
        href: "/images/games/terraforming.jpg",
      },
      genres: [
        { genreId: 1, genreName: "Strategy" },
        { genreId: 7, genreName: "Sci-Fi" },
      ],
    },

    owner: {
      userId: 5,
      username: "petraZD",
      town: "Zadar",
      country: "Croatia",
    },
  },

  {
    listingId: 6,
    condition: "Good",
    isActive: true,
    created_at: "2025-01-22",
    description: "Played regularly, well maintained.",

    media: {
      href: "/images/listings/7wonders-listing.jpg",
    },

    game: {
      gameId: 6,
      gameName: "7 Wonders",
      publisher: "Repos Production",
      yearPublished: 2010,
      maxMinPlayers: "3–7",
      avgPlayTime: 30,
      complexity: 2,
      media: {
        href: "/images/games/7wonders.jpg",
      },
      genres: [
        { genreId: 1, genreName: "Strategy" },
        { genreId: 8, genreName: "Card Game" },
      ],
    },

    owner: {
      userId: 6,
      username: "nikolaPU",
      town: "Pula",
      country: "Croatia",
    },
  },
];
