package com.stiropor.backend.service;

import com.stiropor.backend.dto.OfferResponse;
import com.stiropor.backend.model.Listing;
import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.OfferItem;
import com.stiropor.backend.model.User;
import com.stiropor.backend.repository.ListingRepository;
import com.stiropor.backend.repository.OfferItemRepository;
import com.stiropor.backend.repository.OfferRepository;
import com.stiropor.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OfferServiceTest {

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private OfferItemRepository offerItemRepository;

    @Mock
    private ListingRepository listingRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OfferService offerService;

    private User fromUser;
    private User toUser;
    private Listing requestedListing;
    private Listing offeredListing;

    @BeforeEach
    void setUp() {
        fromUser = new User("from@example.com", null, "fromUser", 1.0, 0.0, null);
        toUser = new User("to@example.com", null, "toUser", 2.0, 0.0, null);

        requestedListing = new Listing();
        requestedListing.setListingId(10);
        requestedListing.setUser(toUser);
        requestedListing.setIsActive(true);

        offeredListing = new Listing();
        offeredListing.setListingId(20);
        offeredListing.setUser(fromUser);
        offeredListing.setIsActive(true);
    }

    @Test
    void testCreateOffer_Success() {
        when(userRepository.findByUserId(1)).thenReturn(fromUser);
        when(listingRepository.findByListingId(10)).thenReturn(requestedListing);
        when(listingRepository.findByListingId(20)).thenReturn(offeredListing);
        when(listingRepository.findById(20)).thenReturn(Optional.of(offeredListing));

        Offer savedOffer = new Offer();
        savedOffer.setOfferId(100);
        savedOffer.setFrom_user(fromUser);
        savedOffer.setTo_user(toUser);
        savedOffer.setListing(requestedListing);
        savedOffer.setMessage("Hello");
        savedOffer.setOffer_status(0);
        savedOffer.setCreatedAt(new Date());

        when(offerRepository.save(any(Offer.class))).thenReturn(savedOffer);
        when(offerItemRepository.save(any(OfferItem.class))).thenReturn(new OfferItem());

        OfferResponse response = offerService.createOffer(10, List.of(20), "Hello", 1);

        assertNotNull(response);
        assertEquals(100, response.getOfferId());
        assertEquals(List.of(20), response.getOfferedListingIds());
        assertEquals(fromUser.getUserId(), response.getFromUserId());
        assertEquals(toUser.getUserId(), response.getToUserId());

        verify(offerRepository, times(2)).save(any(Offer.class)); // notice service saves twice
        verify(offerItemRepository, times(1)).save(any(OfferItem.class));
    }

    @Test
    void testCreateOffer_EmptyOfferedListings() {
        Exception e = assertThrows(IllegalArgumentException.class, () ->
                offerService.createOffer(10, List.of(), "Hello", 1));
        assertEquals("At least one offered listing is required", e.getMessage());
    }

    @Test
    void testCreateOffer_CurrentUserNotFound() {
        when(userRepository.findByUserId(1)).thenReturn(null);

        Exception e = assertThrows(IllegalArgumentException.class, () ->
                offerService.createOffer(10, List.of(20), "Hello", 1));
        assertEquals("Current user not found", e.getMessage());
    }

    @Test
    void testCreateOffer_RequestedListingNotFound() {
        when(userRepository.findByUserId(1)).thenReturn(fromUser);
        when(listingRepository.findByListingId(10)).thenReturn(null);

        Exception e = assertThrows(IllegalArgumentException.class, () ->
                offerService.createOffer(10, List.of(20), "Hello", 1));
        assertEquals("Requested listing not found", e.getMessage());
    }

    @Test
    void testCreateOffer_CannotSendToSelf() {
        requestedListing.setUser(fromUser);
        when(userRepository.findByUserId(1)).thenReturn(fromUser);
        when(listingRepository.findByListingId(10)).thenReturn(requestedListing);

        Exception e = assertThrows(IllegalArgumentException.class, () ->
                offerService.createOffer(10, List.of(20), "Hello", 1));
        assertEquals("Cannot send offer to yourself", e.getMessage());
    }

    @Test
    void testGetOfferById_Success() {
        Offer offer = new Offer();
        offer.setOfferId(100);
        offer.setFrom_user(fromUser);
        offer.setTo_user(toUser);
        offer.setListing(requestedListing);
        offer.setMessage("Hello");
        offer.setOffer_status(0);
        offer.setCreatedAt(new Date());

        OfferItem offerItem = new OfferItem();
        offerItem.setListing(offeredListing);

        when(offerRepository.findById(100)).thenReturn(Optional.of(offer));
        when(offerItemRepository.findByOffer(offer)).thenReturn(List.of(offerItem));

        OfferResponse response = offerService.getOfferById(100, 1);

        assertNotNull(response);
        assertEquals(100, response.getOfferId());
        assertEquals(List.of(20), response.getOfferedListingIds());
    }

    @Test
    void testGetOfferById_NoAccess() {
        Offer offer = new Offer();
        offer.setOfferId(100);
        offer.setFrom_user(fromUser);
        offer.setTo_user(toUser);

        when(offerRepository.findById(100)).thenReturn(Optional.of(offer));

        Exception e = assertThrows(IllegalArgumentException.class, () ->
                offerService.getOfferById(100, 999)); // user id not from/to
        assertEquals("You do not have access to this offer", e.getMessage());
    }

    @Test
    void testGetOfferById_OfferNotFound() {
        when(offerRepository.findById(100)).thenReturn(Optional.empty());

        Exception e = assertThrows(IllegalArgumentException.class, () ->
                offerService.getOfferById(100, 1));
        assertEquals("Offer not found", e.getMessage());
    }
}
