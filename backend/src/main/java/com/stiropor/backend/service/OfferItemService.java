package com.stiropor.backend.service;

import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.OfferItem;
import com.stiropor.backend.repository.OfferItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfferItemService {
    private final OfferItemRepository offerItemRepository;
    public OfferItemService(OfferItemRepository offerItemRepository) {
        this.offerItemRepository = offerItemRepository;
    }

    public List<OfferItem> getByOffer(Offer offer) {
        return offerItemRepository.findAllByOffer(offer);
    }
    public OfferItem save(OfferItem offerItem) {
        return offerItemRepository.save(offerItem);
    }
    public void deleteByOffer(OfferItem offer) {
        offerItemRepository.delete(offer);
    }
    public List<OfferItem> findByListingId (Integer listingId) {
        return  offerItemRepository.findByListing_ListingId(listingId);
    }
}
