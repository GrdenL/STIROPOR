package com.stiropor.backend.repository;

import com.stiropor.backend.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Integer>{
    Genre getByName(String name);
}

