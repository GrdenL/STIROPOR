package com.stiropor.backend.service;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Genre;
import com.stiropor.backend.repository.GameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private GameService gameService;

    private Game testGame;
    private List<Genre> testGenres;

    @BeforeEach
    void setUp() {
        testGenres = new ArrayList<>();
        Genre testGenre = new Genre("Action");
        testGenres.add(testGenre);
        testGame = new Game();
        testGame.setGameId(1);
        testGame.setGameName("Test Game");
        testGame.setGenres(testGenres);
    }

    @Test
    void testFindAll() {
        when(gameRepository.findAll()).thenReturn(List.of(testGame));

        List<Game> games = gameService.findAll();

        assertNotNull(games);
        assertEquals(1, games.size());
        assertEquals(testGame, games.get(0));
        verify(gameRepository, times(1)).findAll();
    }

    @Test
    void testGetByGameName() {
        when(gameRepository.findByGameName("Test Game")).thenReturn(testGame);

        Game game = gameService.getByGameName("Test Game");

        assertNotNull(game);
        assertEquals(testGame, game);
        verify(gameRepository, times(1)).findByGameName("Test Game");
    }

    @Test
    void testFindById() {
        when(gameRepository.findById(1)).thenReturn(Optional.of(testGame));

        Optional<Game> gameOpt = gameService.findById(1);

        assertTrue(gameOpt.isPresent());
        assertEquals(testGame, gameOpt.get());
        verify(gameRepository, times(1)).findById(1);
    }

    @Test
    void testSave() {
        when(gameRepository.save(testGame)).thenReturn(testGame);

        Game savedGame = gameService.save(testGame);

        assertNotNull(savedGame);
        assertEquals(testGame, savedGame);
        verify(gameRepository, times(1)).save(testGame);
    }

    @Test
    void testDelete() {
        doNothing().when(gameRepository).delete(testGame);

        gameService.delete(testGame);

        verify(gameRepository, times(1)).delete(testGame);
    }

    @Test
    void testFindAllByGenre() {
        when(gameRepository.findAllByGenresContaining(testGenres.getLast())).thenReturn(List.of(testGame));

        List<Game> games = gameService.findAllByGenre(testGenres.getLast());

        assertNotNull(games);
        assertEquals(1, games.size());
        assertEquals(testGame, games.get(0));
        verify(gameRepository, times(1)).findAllByGenresContaining(testGenres.getLast());
    }
}
