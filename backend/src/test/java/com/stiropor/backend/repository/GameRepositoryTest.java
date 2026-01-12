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

    private Game testGame;
    private List<Genre> testGenres;

    GameRepositoryTest(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @BeforeEach
    void setUp() {
        Genre testGenre = new Genre("Action");
        testGenres.add(testGenre);
        testGame = new Game();
        testGame.setGameName("Test Game");
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
