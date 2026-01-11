package com.stiropor.backend.service;

import com.stiropor.backend.model.Genre;
import com.stiropor.backend.repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreService {
    private final GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public Genre save(Genre genre) {
        return genreRepository.save(genre);
    }
    public List<Genre> findAll() {
        return genreRepository.findAll();
    }
    public void delete(Genre genre) {
        genreRepository.delete(genre);
    }
    public Genre findByName(String genreName) {
        return genreRepository.findByGenreName(genreName);
    }
}
