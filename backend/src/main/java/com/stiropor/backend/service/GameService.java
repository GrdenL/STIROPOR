package com.stiropor.backend.service;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Genre;
import com.stiropor.backend.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<Game> findAll() {
        return gameRepository.findAll();
    }
    public Game getByGameName(String gameName) {
        return gameRepository.findByGameName(gameName);
    }
    public void delete(Game game) {
        gameRepository.delete(game);
    }
    public Game save(Game game) {
        return gameRepository.save(game);
    }
    public java.util.Optional<Game> findById(Integer gameId) {
        return gameRepository.findById(gameId);
    }
    public List<Game> findAllByGenre(Genre genre) {
        return gameRepository.findAllByGenresContaining(genre);
    }
}
