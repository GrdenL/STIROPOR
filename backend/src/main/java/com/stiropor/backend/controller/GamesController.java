package com.stiropor.backend.controller;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Genre;
import com.stiropor.backend.service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/games")
public class GamesController {

    private final GameService gameService;

    public GamesController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Game>> getAllGames() {
        List<Game> games = gameService.findAll();
        return ResponseEntity.ok(games);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Integer id) {
        Optional<Game> game = gameService.findById(id);
        return game.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{gameName}")
    public ResponseEntity<Game> getGameByName(@PathVariable String gameName) {
        Game game = gameService.getByGameName(gameName);
        if (game != null) {
            return ResponseEntity.ok(game);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/genre")
    public ResponseEntity<List<Game>> getGamesByGenre(@RequestBody Genre genre) {
        List<Game> games = gameService.findAllByGenre(genre);
        return ResponseEntity.ok(games);
    }

    @PostMapping
    public ResponseEntity<Game> createGame(@RequestBody Game game) {
        Game savedGame = gameService.save(game);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGame);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> updateGame(@PathVariable Integer id, @RequestBody Game game) {
        Optional<Game> existingGame = gameService.findById(id);
        if (existingGame.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        game.setGameId(id);
        Game updatedGame = gameService.save(game);
        return ResponseEntity.ok(updatedGame);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Integer id) {
        Optional<Game> game = gameService.findById(id);
        if (game.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        gameService.delete(game.get());
        return ResponseEntity.noContent().build();
    }
}