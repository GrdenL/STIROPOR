export const mockGames = [
  {
    gameId: 1,
    gameName: "Catan",
    publisher: "Kosmos",
    yearPublished: 1995,
    maxMinPlayers: "3–4",
    avgPlayTime: 90,
    complexity: 2,
    media: { href: "/images/games/catan.jpg" },
    genres: [
      { genreId: 1, genreName: "Strategy" },
      { genreId: 2, genreName: "Family" },
    ],
  },

  {
    gameId: 2,
    gameName: "Carcassonne",
    publisher: "Hans im Glück",
    yearPublished: 2000,
    maxMinPlayers: "2–5",
    avgPlayTime: 45,
    complexity: 1,
    media: { href: "/images/games/carcassonne.jpg" },
    genres: [
      { genreId: 2, genreName: "Family" },
      { genreId: 3, genreName: "Tile Placement" },
    ],
  },

  {
    gameId: 3,
    gameName: "Gloomhaven",
    publisher: "Cephalofair Games",
    yearPublished: 2017,
    maxMinPlayers: "1–4",
    avgPlayTime: 120,
    complexity: 4,
    media: { href: "/images/games/gloomhaven.jpg" },
    genres: [
      { genreId: 1, genreName: "Strategy" },
      { genreId: 4, genreName: "Adventure" },
      { genreId: 5, genreName: "Cooperative" },
    ],
  },

  {
    gameId: 4,
    gameName: "Azul",
    publisher: "Next Move Games",
    yearPublished: 2017,
    maxMinPlayers: "2–4",
    avgPlayTime: 30,
    complexity: 1,
    media: { href: "/images/games/azul.jpg" },
    genres: [
      { genreId: 2, genreName: "Family" },
      { genreId: 6, genreName: "Abstract" },
    ],
  },
];
