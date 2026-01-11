package com.stiropor.backend.service;

import com.stiropor.backend.model.Listing;
import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.OfferItem;
import com.stiropor.backend.repository.OfferItemRepository;
import com.stiropor.backend.repository.OfferRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfferService {
    private final OfferRepository offerRepository;
    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    public List<Offer> getByOffer(Listing listing) {
        return offerRepository.findByListing(listing);
    }
    public Offer save(Offer offer) {
        return offerRepository.save(offer);
    }
    public void delete(Offer offer) {
        offerRepository.delete(offer);
    }
}
