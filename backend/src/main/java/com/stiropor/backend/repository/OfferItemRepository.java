package com.stiropor.backend.repository;

import com.stiropor.backend.model.Listing;
import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.OfferItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferItemRepository extends JpaRepository<OfferItem,Integer> {
    List<OfferItem> findAllByOffer(Offer offer);
}
