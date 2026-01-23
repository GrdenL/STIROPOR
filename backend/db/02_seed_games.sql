INSERT INTO games (
  game_id,
  game_name,
  publisher,
  max_min_players,
  avg_play_time,
  complexity,
  year_published
)
VALUES
  (1, 'Catan', 'Kosmos', '3–4', 90, 2, 1995),
  (2, 'Carcassonne', 'Hans im Gluck', '2–5', 45, 1, 2000),
  (3, 'Gloomhaven', 'Cephalofair Games', '1–4', 120, 4, 2017),
  (4, 'Azul', 'Next Move Games', '2–4', 30, 1, 2017),
  (5, 'Cezar i Kleopatra', 'Unknown', '2–4', 60, 2, 2000),
  (6, 'Codenames', 'Unknown', '2–8', 15, 1, 2015),
  (7, 'Connect 4 Shots', 'Unknown', '2–4', 20, 1, 2019),
  (8, 'Escape Room', 'Unknown', '2–6', 60, 2, 2018),
  (9, 'Illusion', 'Unknown', '2–5', 20, 1, 2018),
  (10, 'Kingdomino', 'Unknown', '2–4', 15, 1, 2016),
  (11, 'Monopoly Metallica World Tour', 'Unknown', '2–6', 90, 2, 2019),
  (12, 'Otok blaga', 'Unknown', '2–4', 45, 2, 2005),
  (13, 'Pandemic', 'Unknown', '2–4', 45, 3, 2008),
  (14, 'Put oko svijeta', 'Unknown', '2–6', 45, 1, 2004),
  (15, 'Rizik', 'Unknown', '2–6', 120, 2, 1959),
  (16, 'Smart Choice Labyrinth', 'Unknown', '2–4', 30, 1, 2010),
  (17, 'The Slow Motion Race Game', 'Unknown', '2–4', 30, 1, 2012),
  (18, 'Ticket to Ride Europe', 'Unknown', '2–5', 60, 2, 2005),
  (19, 'Ubongo', 'Unknown', '1–4', 30, 1, 2003)
ON CONFLICT (game_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('games', 'game_id'),
              COALESCE((SELECT MAX(game_id) FROM games), 1),
              true);
