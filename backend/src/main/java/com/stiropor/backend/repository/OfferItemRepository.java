package com.stiropor.backend.repository;

import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.OfferItem;
import com.stiropor.backend.model.OfferItemID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferItemRepository extends JpaRepository<OfferItem, OfferItemID> {

    List<OfferItem> findByOffer(Offer offer);
    List<OfferItem> findByOffer_OfferId(Integer offerId);
    List<OfferItem> findByListing_ListingId(Integer listingId);
    List<OfferItem> findAllByOffer(Offer offer);
}