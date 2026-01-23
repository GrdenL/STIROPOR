package com.stiropor.backend.repository;

import com.stiropor.backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IsGenreRepository extends JpaRepository<IsGenre, IsGenreId> {
    @Query("SELECT g.game FROM IsGenre g WHERE g.genre = :genre")
    List<Game> findGamesByGenre(@Param("genre") Genre genre);

    @Query("SELECT g.game FROM IsGenre g WHERE g.id.genreId = :genreId")
    List<Game> findGamesByGenreId(@Param("genreId") Integer genreId);
}
