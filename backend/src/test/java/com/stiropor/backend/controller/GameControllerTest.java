package com.stiropor.backend.controller;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Genre;
import com.stiropor.backend.service.GameService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GamesControllerTest {

    @Mock
    private GameService gameService;

    @InjectMocks
    private GamesController gamesController;

    private Game testGame;
    private List<Genre> testGenres;

    @BeforeEach
    void setUp() {
        Genre testGenre = new Genre("Action");
        testGenres.add(testGenre);
        testGame = new Game();
        testGame.setGameId(1);
        testGame.setGameName("Test Game");
        testGame.setGenres(testGenres);
    }

    @Test
    void testGetAllGames() {
        when(gameService.findAll()).thenReturn(List.of(testGame));

        ResponseEntity<List<Game>> response = gamesController.getAllGames();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(testGame, response.getBody().get(0));
        verify(gameService, times(1)).findAll();
    }

    @Test
    void testGetGameById_Found() {
        when(gameService.findById(1)).thenReturn(Optional.of(testGame));

        ResponseEntity<Game> response = gamesController.getGameById(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testGame, response.getBody());
        verify(gameService, times(1)).findById(1);
    }

    @Test
    void testGetGameById_NotFound() {
        when(gameService.findById(1)).thenReturn(Optional.empty());

        ResponseEntity<Game> response = gamesController.getGameById(1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetGameByName_Found() {
        when(gameService.getByGameName("Test Game")).thenReturn(testGame);

        ResponseEntity<Game> response = gamesController.getGameByName("Test Game");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testGame, response.getBody());
        verify(gameService, times(1)).getByGameName("Test Game");
    }

    @Test
    void testGetGameByName_NotFound() {
        when(gameService.getByGameName("Unknown")).thenReturn(null);

        ResponseEntity<Game> response = gamesController.getGameByName("Unknown");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetGamesByGenre() {
        when(gameService.findAllByGenre(testGenres.getLast())).thenReturn(List.of(testGame));

        ResponseEntity<List<Game>> response = gamesController.getGamesByGenre(testGenres.getLast());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(testGame, response.getBody().get(0));
        verify(gameService, times(1)).findAllByGenre(testGenres.getLast());
    }

    @Test
    void testCreateGame() {
        when(gameService.save(testGame)).thenReturn(testGame);

        ResponseEntity<Game> response = gamesController.createGame(testGame);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(testGame, response.getBody());
        verify(gameService, times(1)).save(testGame);
    }

    @Test
    void testUpdateGame_Found() {
        when(gameService.findById(1)).thenReturn(Optional.of(testGame));
        when(gameService.save(testGame)).thenReturn(testGame);

        ResponseEntity<Game> response = gamesController.updateGame(1, testGame);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testGame, response.getBody());
        verify(gameService, times(1)).findById(1);
        verify(gameService, times(1)).save(testGame);
    }

    @Test
    void testUpdateGame_NotFound() {
        when(gameService.findById(1)).thenReturn(Optional.empty());

        ResponseEntity<Game> response = gamesController.updateGame(1, testGame);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(gameService, times(1)).findById(1);
        verify(gameService, never()).save(any());
    }

    @Test
    void testDeleteGame_Found() {
        when(gameService.findById(1)).thenReturn(Optional.of(testGame));
        doNothing().when(gameService).delete(testGame);

        ResponseEntity<Void> response = gamesController.deleteGame(1);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(gameService, times(1)).findById(1);
        verify(gameService, times(1)).delete(testGame);
    }

    @Test
    void testDeleteGame_NotFound() {
        when(gameService.findById(1)).thenReturn(Optional.empty());

        ResponseEntity<Void> response = gamesController.deleteGame(1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(gameService, times(1)).findById(1);
        verify(gameService, never()).delete(any());
    }
}
