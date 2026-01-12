package com.stiropor.backend.repository;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Genre;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class GameRepositoryTest {
    private final GameRepository gameRepository;
    private final GenreRepository genreRepository;

    private Game testGame;
    private List<Genre> testGenres;

    @Autowired
    GameRepositoryTest(GameRepository gameRepository, GenreRepository genreRepository) {
        this.gameRepository = gameRepository;
        this.genreRepository = genreRepository;
    }

    @BeforeEach
    void setUp() {
        testGenres = new ArrayList<>();
        Genre testGenre = genreRepository.save(new Genre("Action"));
        testGenres.add(testGenre);
        testGame = new Game();
        testGame.setGameName("Test Game");
        testGame.setPublisher("Test Publisher");
        testGame.setMaxMinPlayers("2-4");
        testGame.setAvgPlayTime(60);
        testGame.setComplexity(2);
        testGame.setYearPublished(2020);
        testGame.setGenres(testGenres);

        gameRepository.save(testGame);
    }

    @Test
    void testFindByGameName_Found() {
        Game game = gameRepository.findByGameName("Test Game");

        assertNotNull(game);
        assertEquals("Test Game", game.getGameName());
        assertEquals("Action", game.getGenres().getFirst().getGenreName());
    }

    @Test
    void testFindByGameName_NotFound() {
        Game game = gameRepository.findByGameName("Unknown Game");
        assertNull(game);
    }

    @Test
    void testFindAllByGenresContaining() {
        List<Game> games = gameRepository.findAllByGenresContaining(testGenres.getLast());

        assertNotNull(games);
        assertEquals(1, games.size());
        assertEquals(testGame.getGameName(), games.get(0).getGameName());
    }
}
