package com.stiropor.backend.repository;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {
    Game findByGameName(String gameName);
    List<Game> findAllByGenresContaining(Genre genre);
}
