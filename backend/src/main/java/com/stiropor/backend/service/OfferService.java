package com.stiropor.backend.service;

import com.stiropor.backend.dto.OfferResponse;
import com.stiropor.backend.model.*;
import com.stiropor.backend.repository.ListingRepository;
import com.stiropor.backend.repository.OfferRepository;
import com.stiropor.backend.repository.OfferItemRepository;
import com.stiropor.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private OfferItemRepository offerItemRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public OfferResponse createOffer(
            Integer requestedListingId,
            List<Integer> offeredListingIds,
            String message,
            Integer currentUserId) {

        if (offeredListingIds == null || offeredListingIds.isEmpty()) {
            throw new IllegalArgumentException("At least one offered listing is required");
        }

        // Get current user
        User fromUser = userRepository.findByUserId(currentUserId);
        if (fromUser == null) {
            throw new IllegalArgumentException("Current user not found");
        }

        // Get requested listing
        Listing targetListing = listingRepository.findByListingId(requestedListingId);
        if (targetListing == null) {
            throw new IllegalArgumentException("Requested listing not found");
        }

        if (Boolean.FALSE.equals(targetListing.getIsActive())) {
            throw new IllegalArgumentException("Requested listing is not active");
        }

        // Get recipient
        User toUser = targetListing.getUser();
        if (toUser == null) {
            throw new IllegalStateException("Requested listing has no owner");
        }

        if (currentUserId.equals(toUser.getUserId())) {
            throw new IllegalArgumentException("Cannot send offer to yourself");
        }

        // Validate offered listings
        List<Listing> offeredListings = new ArrayList<>();

        for (Integer listingId : offeredListingIds) {
            Listing offeredListing = listingRepository.findByListingId(listingId);
            if (offeredListing == null) {
                throw new IllegalArgumentException("Offered listing " + listingId + " not found");
            }

            if (!offeredListing.getUser().getUserId().equals(currentUserId)) {
                throw new IllegalArgumentException("You do not own listing " + listingId);
            }

            if (Boolean.FALSE.equals(offeredListing.getIsActive())) {
                throw new IllegalArgumentException("Offered listing " + listingId + " is not active");
            }

            offeredListings.add(offeredListing);
        }
        System.out.println("----------------------" + offeredListings.size());

        // Create offer
        Offer offer = new Offer();
        offer.setOffer_status(0); // PENDING
        offer.setMessage(message);
        offer.setFrom_user(fromUser);
        offer.setTo_user(toUser);
        offer.setListing(targetListing);

        // Save offer first
        Offer savedOffer = offerRepository.save(offer);
        System.out.println("Saved offer " + savedOffer.getOfferId());

        // Save offer first
        Offer saveddOffer = offerRepository.save(offer);

        // Then create offer items
        for (Integer listingId : offeredListingIds) {
            Listing offeredListing = listingRepository.findById(listingId)
                    .orElseThrow(() -> new IllegalArgumentException("Listing " + listingId + " not found"));
            OfferItem offerItem = new OfferItem(saveddOffer, offeredListing, 1);
            offerItemRepository.save(offerItem);
        }
        System.out.println("---------------------" + mapToResponse(offer, offeredListingIds));
        return mapToResponse(savedOffer, offeredListingIds);
    }

    public OfferResponse getOfferById(Integer offerId, Integer currentUserId) {

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found"));

        Integer fromUserId = offer.getFrom_user().getUserId();
        Integer toUserId = offer.getTo_user().getUserId();

        if (!currentUserId.equals(fromUserId) && !currentUserId.equals(toUserId)) {
            throw new IllegalArgumentException("You do not have access to this offer");
        }

        List<Integer> offeredListingIds = offerItemRepository.findByOffer(offer)
                .stream()
                .map(item -> item.getListing().getListingId())
                .collect(Collectors.toList());

        return mapToResponse(offer, offeredListingIds);
    }

    private OfferResponse mapToResponse(Offer offer, List<Integer> offeredListingIds) {
        OfferResponse response = new OfferResponse();
        response.setOfferId(offer.getOfferId());
        response.setFromUserId(offer.getFrom_user().getUserId());
        response.setFromUsername(offer.getFrom_user().getUsername());
        response.setToUserId(offer.getTo_user().getUserId());
        response.setToUsername(offer.getTo_user().getUsername());
        response.setTargetListingId(offer.getListing().getListingId());
        response.setOfferedListingIds(offeredListingIds);
        response.setMessage(offer.getMessage());
        response.setOfferStatus(offer.getOffer_status());
        response.setCreatedAt(offer.getCreatedAt());
        return response;
    }
}