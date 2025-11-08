CREATE TABLE Country
(
  countryId INT NOT NULL,
  countryName VARCHAR NOT NULL,
  PRIMARY KEY (countryId)
);

CREATE TABLE Town
(
  townId INT NOT NULL,
  townName VARCHAR NOT NULL,
  countryId INT NOT NULL,
  PRIMARY KEY (townId),
  FOREIGN KEY (countryId) REFERENCES Country(countryId)
);

CREATE TABLE Genres
(
  genreId INT NOT NULL,
  genreName VARCHAR NOT NULL,
  PRIMARY KEY (genreId)
);

CREATE TABLE Users
(
  googleId VARCHAR UNIQUE,
  userId INT NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  username VARCHAR NOT NULL UNIQUE,
  role VARCHAR NOT NULL,
  description VARCHAR,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  created_at DATE NOT NULL,
  townId INT NOT NULL,
  PRIMARY KEY (userId),
  FOREIGN KEY (townId) REFERENCES Town(townId)
);

CREATE TABLE Media
(
  mediaId INT NOT NULL,
  href VARCHAR NOT NULL,
  userId INT NOT NULL,
  PRIMARY KEY (mediaId),
  FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE Games
(
  gameId INT NOT NULL,
  gameName VARCHAR NOT NULL,
  publisher VARCHAR NOT NULL,
  maxMinPlayers VARCHAR NOT NULL,
  avgPlayTime INT NOT NULL,
  complexity INT NOT NULL,
  yearPublished INT NOT NULL,
  mediaId INT NOT NULL,
  PRIMARY KEY (gameId),
  FOREIGN KEY (mediaId) REFERENCES Media(mediaId)
);

CREATE TABLE Listing
(
  listingId INT NOT NULL,
  condition VARCHAR NOT NULL,
  isActive BOOL NOT NULL,
  created_at DATE NOT NULL,
  description VARCHAR,
  userId INT NOT NULL,
  gameId INT NOT NULL,
  mediaId INT NOT NULL,
  PRIMARY KEY (listingId),
  FOREIGN KEY (userId) REFERENCES Users(userId),
  FOREIGN KEY (gameId) REFERENCES Games(gameId),
  FOREIGN KEY (mediaId) REFERENCES Media(mediaId)
);

CREATE TABLE Offers
(
  offerId INT NOT NULL,
  offer_status INT NOT NULL,
  message VARCHAR,
  created_at DATE NOT NULL,
  from_userId INT NOT NULL,
  to_userId INT NOT NULL,
  target_listingId INT NOT NULL,
  PRIMARY KEY (offerId),
  FOREIGN KEY (from_userId) REFERENCES Users(userId),
  FOREIGN KEY (to_userId) REFERENCES Users(userId),
  FOREIGN KEY (target_listingId) REFERENCES Listing(listingId)
);

CREATE TABLE Trade
(
  tradeId INT NOT NULL,
  agreed_at DATE NOT NULL,
  trade_status INT NOT NULL,
  rating_from_buyer INT NOT NULL,
  rating_from_seller INT NOT NULL,
  offerId INT NOT NULL,
  PRIMARY KEY (tradeId),
  FOREIGN KEY (offerId) REFERENCES Offers(offerId)
);

CREATE TABLE Notifications
(
  notification_id INT NOT NULL,
  type VARCHAR NOT NULL,
  payload NUMERIC NOT NULL,
  is_read BOOL NOT NULL,
  created_at DATE NOT NULL,
  userId INT NOT NULL,
  PRIMARY KEY (notification_id),
  FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE whishesFor
(
  userId INT NOT NULL,
  gameId INT NOT NULL,
  PRIMARY KEY (userId, gameId),
  FOREIGN KEY (userId) REFERENCES Users(userId),
  FOREIGN KEY (gameId) REFERENCES Games(gameId)
);

CREATE TABLE isGenre
(
  gameId INT NOT NULL,
  genreId INT NOT NULL,
  PRIMARY KEY (gameId, genreId),
  FOREIGN KEY (gameId) REFERENCES Games(gameId),
  FOREIGN KEY (genreId) REFERENCES Genres(genreId)
);

CREATE TABLE isIntrested
(
  userId INT NOT NULL,
  genreId INT NOT NULL,
  PRIMARY KEY (userId, genreId),
  FOREIGN KEY (userId) REFERENCES Users(userId),
  FOREIGN KEY (genreId) REFERENCES Genres(genreId)
);

CREATE TABLE OfferItems
(
  quantity INT NOT NULL,
  offerId INT NOT NULL,
  listingId INT NOT NULL,
  PRIMARY KEY (offerId, listingId),
  FOREIGN KEY (offerId) REFERENCES Offers(offerId),
  FOREIGN KEY (listingId) REFERENCES Listing(listingId)
);