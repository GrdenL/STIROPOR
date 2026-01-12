package com.stiropor.backend.repository;

import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.Listing;
import com.stiropor.backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class OfferRepositoryTest {

    private OfferRepository offerRepository;

    private User fromUser;
    private User toUser;
    private Listing listing1;
    private Listing listing2;

    OfferRepositoryTest(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    @BeforeEach
    void setUp() {
        fromUser = new User("from@example.com", null, "fromUser", 1.0, 0.0, null);
        toUser = new User("to@example.com", null, "toUser", 2.0, 0.0, null);

        listing1 = new Listing();
        listing1.setListingId(1);
        listing1.setUser(fromUser);

        listing2 = new Listing();
        listing2.setListingId(2);
        listing2.setUser(toUser);

        Offer offer1 = new Offer();
        offer1.setOfferId(100);
        offer1.setFrom_user(fromUser);
        offer1.setTo_user(toUser);
        offer1.setListing(listing2);
        offer1.setMessage("Offer 1");

        Offer offer2 = new Offer();
        offer2.setOfferId(101);
        offer2.setFrom_user(toUser);
        offer2.setTo_user(fromUser);
        offer2.setListing(listing1);
        offer2.setMessage("Offer 2");

        offerRepository.saveAll(List.of(offer1, offer2));
    }

    @Test
    void testFindByFromUserId() {
        List<Offer> fromUserOffers = offerRepository.findByFromUserId(fromUser.getUserId());

        assertNotNull(fromUserOffers);
        assertEquals(1, fromUserOffers.size());
        assertEquals(fromUser.getUserId(), fromUserOffers.get(0).getFrom_user().getUserId());
        assertEquals("Offer 1", fromUserOffers.get(0).getMessage());
    }

    @Test
    void testFindByToUserId() {
        List<Offer> toUserOffers = offerRepository.findByToUserId(toUser.getUserId());

        assertNotNull(toUserOffers);
        assertEquals(1, toUserOffers.size());
        assertEquals(toUser.getUserId(), toUserOffers.get(0).getTo_user().getUserId());
        assertEquals("Offer 1", toUserOffers.get(0).getMessage());
    }
}
