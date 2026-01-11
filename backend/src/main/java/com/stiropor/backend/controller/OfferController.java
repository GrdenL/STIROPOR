package com.stiropor.backend.controller;

import com.stiropor.backend.model.*;
import com.stiropor.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/offers")
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private OfferItemRepository offerItemRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;


    @PostMapping
    public ResponseEntity<?> createOffer(@RequestBody OfferPayload payload) {

        // For testing, assume fromUserId = 1
        User fromUser = userRepository.findByUserId(1);

        Listing requestedListing = listingRepository.findById(payload.getRequestedListingId())
                .orElseThrow(() -> new RuntimeException("Requested listing not found"));
        User toUser = requestedListing.getUser();

        Offer offer = new Offer();
        offer.setOffer_status(0);
        offer.setMessage(payload.getMessage());
        offer.setFrom_user(fromUser);
        offer.setTo_user(toUser);
        offer.setListing(requestedListing);

        Offer savedOffer = offerRepository.save(offer);

        List<OfferItem> items = payload.getOfferedListingIds().stream().map(listingId -> {
            Listing offeredListing = listingRepository.findById(listingId)
                    .orElseThrow(() -> new RuntimeException("Offered listing not found: " + listingId));
            return new OfferItem(savedOffer, offeredListing, 1);
        }).collect(Collectors.toList());

        offerItemRepository.saveAll(items);

        return ResponseEntity.ok(savedOffer);
    }


    public static class OfferPayload {

        private Integer requestedListingId;
        private List<Integer> offeredListingIds;
        private String message;

        public Integer getRequestedListingId() { return requestedListingId; }
        public void setRequestedListingId(Integer requestedListingId) { this.requestedListingId = requestedListingId; }

        public List<Integer> getOfferedListingIds() { return offeredListingIds; }
        public void setOfferedListingIds(List<Integer> offeredListingIds) { this.offeredListingIds = offeredListingIds; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
