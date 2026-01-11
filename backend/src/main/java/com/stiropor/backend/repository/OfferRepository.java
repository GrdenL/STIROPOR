package com.stiropor.backend.repository;

import com.stiropor.backend.model.Listing;
import com.stiropor.backend.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer,Integer> {
    List<Offer> findByListing(Listing listing);
}
