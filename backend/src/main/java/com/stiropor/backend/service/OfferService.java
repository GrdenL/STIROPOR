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
import java.util.Optional;
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

    @Autowired
    private NotificationService notificationService;

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

        // Create offer
        Offer offer = new Offer();
        offer.setOffer_status(0); // PENDING
        offer.setMessage(message);
        offer.setFrom_user(fromUser);
        offer.setTo_user(toUser);
        offer.setListing(targetListing);

        // Save offer first to get the ID
        Offer savedOffer = offerRepository.save(offer);

        // Then create offer items
        List<OfferItem> offerItems = new ArrayList<>();
        for (Listing offeredListing : offeredListings) {
            // Use the constructor that sets the composite ID
            OfferItem offerItem = new OfferItem(savedOffer, offeredListing, 1);
            offerItems.add(offerItem);
        }

        // Save all offer items
        offerItemRepository.saveAll(offerItems);

        // Add items to offer (if you have a bidirectional relationship)
        // This depends on your Offer entity having a collection of OfferItems
        // savedOffer.setOfferItems(offerItems);

        List<Integer> offeredListingIdsList = offeredListings.stream()
                .map(Listing::getListingId)
                .collect(Collectors.toList());

        return mapToResponse(savedOffer, offeredListingIdsList);
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

    /**
     * Get all offers received by a user (offers for their listings)
     */
    public List<OfferResponse> getReceivedOffers(Integer userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        // Find all offers where this user is the recipient (to_user)
        List<Offer> offers = offerRepository.findByToUser(user);

        return offers.stream()
                .map(offer -> {
                    List<Integer> offeredListingIds = offerItemRepository.findByOffer(offer)
                            .stream()
                            .map(item -> item.getListing().getListingId())
                            .collect(Collectors.toList());
                    return mapToResponse(offer, offeredListingIds);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get all offers sent by a user (offers they created)
     */
    public List<OfferResponse> getSentOffers(Integer userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        // Find all offers where this user is the sender (from_user)
        List<Offer> offers = offerRepository.findByFromUser(user);

        return offers.stream()
                .map(offer -> {
                    List<Integer> offeredListingIds = offerItemRepository.findByOffer(offer)
                            .stream()
                            .map(item -> item.getListing().getListingId())
                            .collect(Collectors.toList());
                    return mapToResponse(offer, offeredListingIds);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get all offers related to a user (both sent and received)
     */
    public List<OfferResponse> getAllUserOffers(Integer userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        // Find all offers where user is either sender or recipient
        List<Offer> sentOffers = offerRepository.findByFromUser(user);
        List<Offer> receivedOffers = offerRepository.findByToUser(user);

        // Combine both lists
        List<Offer> allOffers = new ArrayList<>(sentOffers);
        for (Offer offer : receivedOffers) {
            if (!allOffers.contains(offer)) {
                allOffers.add(offer);
            }
        }

        // Sort by creation date (newest first)
        allOffers.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        return allOffers.stream()
                .map(offer -> {
                    List<Integer> offeredListingIds = offerItemRepository.findByOffer(offer)
                            .stream()
                            .map(item -> item.getListing().getListingId())
                            .collect(Collectors.toList());
                    return mapToResponse(offer, offeredListingIds);
                })
                .collect(Collectors.toList());
    }

    /**
     * Update the status of an offer
     * Status values: 0 = PENDING, 1 = ACCEPTED, 2 = DECLINED, 3 = CANCELLED
     */
    @Transactional
    public OfferResponse updateOfferStatus(Integer offerId, Integer newStatus, Integer currentUserId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found"));

        Integer fromUserId = offer.getFrom_user().getUserId();
        Integer toUserId = offer.getTo_user().getUserId();

        // Validate status value
        if (newStatus < 0 || newStatus > 3) {
            throw new IllegalArgumentException("Invalid status. Must be 0 (PENDING), 1 (ACCEPTED), 2 (DECLINED), or 3 (CANCELLED)");
        }

        // Check permissions based on the status change
        if (newStatus == 1 || newStatus == 2) {
            // Only the recipient can accept (1) or decline (2)
            if (!currentUserId.equals(toUserId)) {
                throw new SecurityException("Only the listing owner can accept or decline offers");
            }
        } else if (newStatus == 3) {
            // Only the offer creator can cancel (3)
            if (!currentUserId.equals(fromUserId)) {
                throw new SecurityException("Only the offer creator can cancel the offer");
            }
        }

        // Validate status transition - can only modify pending offers
        if (offer.getOffer_status() != 0) {
            throw new IllegalArgumentException("Can only modify pending offers");
        }

        offer.setOffer_status(newStatus);

        // If accepted, mark listings as inactive
        if (newStatus == 1) {
            // Mark target listing as inactive
            Listing targetListing = offer.getListing();
            targetListing.setIsActive(false);
            targetListing.setUser(offer.getFrom_user());
            listingRepository.save(targetListing);

            // Mark all offered listings as inactive
            List<OfferItem> offerItems = offerItemRepository.findByOffer(offer);
            for (OfferItem item : offerItems) {
                Listing offeredListing = item.getListing();
                offeredListing.setIsActive(false);
                offeredListing.setUser(offer.getTo_user());
                listingRepository.save(offeredListing);
            }
        }

        Offer updatedOffer = offerRepository.save(offer);

        List<Integer> offeredListingIds = offerItemRepository.findByOffer(updatedOffer)
                .stream()
                .map(item -> item.getListing().getListingId())
                .collect(Collectors.toList());

        return mapToResponse(updatedOffer, offeredListingIds);
    }

    /**
     * Cancel an offer (convenience method)
     */
    @Transactional
    public void cancelOffer(Integer offerId, Integer currentUserId) {
        this.cancelOffer(offerId, currentUserId);
        updateOfferStatus(offerId, 3, currentUserId); // 3 = CANCELLED
    }

    /**
     * Accept an offer (convenience method)
     */
    @Transactional
    public OfferResponse acceptOffer(Integer offerId, Integer currentUserId) {
        this.cancelOffer(offerId, currentUserId);
        return updateOfferStatus(offerId, 1, currentUserId); // 1 = ACCEPTED
    }

    /**
     * Decline an offer (convenience method)
     */
    @Transactional
    public OfferResponse declineOffer(Integer offerId, Integer currentUserId) {
        this.cancelOffer(offerId, currentUserId);
        return updateOfferStatus(offerId, 2, currentUserId); // 2 = DECLINED
    }

    @Transactional
    protected void cancelAndDeclineOtherOffers(Integer offerId, Integer currentUserId) {
        Listing listing = offerRepository.findListingByOfferId(offerId);
        List<Offer> offers = offerRepository.findByListingId(listing.getListingId());
        List<OfferItem> offerItems = offerItemRepository.findByListing_ListingId(listing.getListingId());
        for (Offer offer : offers) {
            if (!offer.getOfferId().equals(offerId)){
                User sender = userRepository.findByUserId(currentUserId);
                if(offer.getFrom_user().getUserId().equals(currentUserId)){
                    offer.setOffer_status(3);
                    notificationService.createAndSendNotification(
                            offer.getTo_user(),
                            sender.getEmail(),
                            "OFFER_CANCELLED",
                            offer.getOfferId(),
                            "An offer for you has been cancelled!",
                            "User " + sender.getUsername() + " has cancelled their offer!"
                    );
                }else{
                    offer.setOffer_status(2);
                    notificationService.createAndSendNotification(
                            offer.getFrom_user(),
                            sender.getEmail(),
                            "OFFER_DECLINED",
                            offer.getOfferId(),
                            "An offer for you has been declined!",
                            "User " + sender.getUsername() + " has declined your offer!"
                    );
                }
                this.save(offer);
            }
        }
        for(OfferItem offerItem : offerItems){
            if(!offerItem.getId().getOfferId().equals(offerId)){
                User sender = userRepository.findByUserId(currentUserId);
                Offer offer = offerItem.getOffer();
                if(offer.getFrom_user().getUserId().equals(currentUserId)){
                    offer.setOffer_status(3);
                    notificationService.createAndSendNotification(
                            offer.getTo_user(),
                            sender.getEmail(),
                            "OFFER_CANCELLED",
                            offer.getOfferId(),
                            "An offer for you has been cancelled!",
                            "User " + sender.getUsername() + " has cancelled their offer!"
                    );
                }else{
                    offer.setOffer_status(2);
                    notificationService.createAndSendNotification(
                            offer.getFrom_user(),
                            sender.getEmail(),
                            "OFFER_DECLINED",
                            offer.getOfferId(),
                            "An offer for you has been declined!",
                            "User " + sender.getUsername() + " has declined your offer!"
                    );
                }
                this.save(offer);
            }
        }
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

    public List<Offer> findByListingId(Integer listingId){
        return  offerRepository.findByListingId(listingId);
    }

    public Offer save(Offer offer) {
        return offerRepository.save(offer);
    }
}
