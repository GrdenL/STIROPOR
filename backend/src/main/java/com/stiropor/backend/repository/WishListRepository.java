package com.stiropor.backend.repository;

import com.stiropor.backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<WishList, WishListId>{
    @Query("SELECT w.game FROM WishList w WHERE w.user = :user")
    List<Game> findGamesByUser(@Param("user") User user);

    @Query("SELECT w.game FROM WishList w WHERE w.id.userId = :userId")
    List<Game> findGamesByUserId(@Param("userId") Integer userId);
}
