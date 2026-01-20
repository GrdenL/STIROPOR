package com.stiropor.backend.repository;

import com.stiropor.backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterestedRepository extends JpaRepository<Interested, InterestedId> {
    @Query("SELECT w.genre FROM Interested w WHERE w.user = :user")
    List<Genre> findGenresByUser(@Param("user") User user);

    @Query("SELECT w.genre FROM Interested w WHERE w.id.userId = :userId")
    List<Genre> findGenresByUserId(@Param("userId") Integer userId);
}
