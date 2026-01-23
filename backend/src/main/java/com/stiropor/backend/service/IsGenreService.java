package com.stiropor.backend.service;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Genre;
import com.stiropor.backend.model.IsGenre;
import com.stiropor.backend.repository.IsGenreRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IsGenreService {
    private final IsGenreRepository isGenreRepository;

    public IsGenreService(IsGenreRepository isGenreRepository) {
        this.isGenreRepository = isGenreRepository;
    }

    public IsGenre save(IsGenre isGenre) {
        return isGenreRepository.save(isGenre);
    }
    public void delete(IsGenre isGenre) {
        isGenreRepository.delete(isGenre);
    }
    public List<Game> findGamesByGenreId(Integer genreId) {
        return isGenreRepository.findGamesByGenreId(genreId);
    }
    public List<Game> findGamesByGenre(Genre genre) {
        return isGenreRepository.findGamesByGenre(genre);
    }
}
