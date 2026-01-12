package com.stiropor.backend.repository;

import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Integer> {

    @Query("SELECT o FROM Offer o WHERE o.from_user = :fromUser")
    List<Offer> findByFromUser(@Param("fromUser") User fromUser);

    @Query("SELECT o FROM Offer o WHERE o.to_user = :toUser")
    List<Offer> findByToUser(@Param("toUser") User toUser);

    @Query("SELECT o FROM Offer o WHERE o.listing.listingId = :listingId")
    List<Offer> findByListingId(@Param("listingId") Integer listingId);

    @Query("SELECT o FROM Offer o WHERE o.offer_status = :status")
    List<Offer> findByOfferStatus(@Param("status") Integer status);

    @Query("select o from Offer o where o.from_user.userId = :userId")
    List<Offer> findByFromUserId(@Param("userId") Integer userId);

    @Query("select o from Offer o where o.to_user.userId = :userId")
    List<Offer> findByToUserId(@Param("userId") Integer userId);
}