package com.stiropor.backend.repository;

import com.stiropor.backend.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Integer> {

    @Query("select o from Offer o where o.from_user.userId = :userId")
    List<Offer> findByFromUserId(@Param("userId") Integer userId);

    @Query("select o from Offer o where o.to_user.userId = :userId")
    List<Offer> findByToUserId(@Param("userId") Integer userId);
}