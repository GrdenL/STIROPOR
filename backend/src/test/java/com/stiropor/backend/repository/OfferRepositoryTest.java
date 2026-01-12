package com.stiropor.backend.repository;

import com.stiropor.backend.model.Country;
import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Listing;
import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.Town;
import com.stiropor.backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class OfferRepositoryTest {

    private final OfferRepository offerRepository;
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final GameRepository gameRepository;
    private final CountryRepository countryRepository;
    private final TownRepository townRepository;

    private User fromUser;
    private User toUser;
    private Listing listing1;
    private Listing listing2;

    @Autowired
    OfferRepositoryTest(OfferRepository offerRepository,
                        UserRepository userRepository,
                        ListingRepository listingRepository,
                        GameRepository gameRepository,
                        CountryRepository countryRepository,
                        TownRepository townRepository) {
        this.offerRepository = offerRepository;
        this.userRepository = userRepository;
        this.listingRepository = listingRepository;
        this.gameRepository = gameRepository;
        this.countryRepository = countryRepository;
        this.townRepository = townRepository;
    }

    @BeforeEach
    void setUp() {
        Country country = countryRepository.save(new Country("TestCountry"));
        Town town = townRepository.save(new Town("TestTown", country));

        fromUser = userRepository.save(new User("from@example.com", null, "fromUser", 1.0, 0.0, town));
        toUser = userRepository.save(new User("to@example.com", null, "toUser", 2.0, 0.0, town));

        Game game = new Game();
        game.setGameName("Test Game");
        game.setPublisher("Test Publisher");
        game.setMaxMinPlayers("2-4");
        game.setAvgPlayTime(60);
        game.setComplexity(2);
        game.setYearPublished(2020);
        game = gameRepository.save(game);

        listing1 = new Listing();
        listing1.setCondition("Good");
        listing1.setIsActive(true);
        listing1.setUser(fromUser);
        listing1.setGame(game);
        listing1 = listingRepository.save(listing1);

        listing2 = new Listing();
        listing2.setCondition("Like New");
        listing2.setIsActive(true);
        listing2.setUser(toUser);
        listing2.setGame(game);
        listing2 = listingRepository.save(listing2);

        Offer offer1 = new Offer();
        offer1.setFrom_user(fromUser);
        offer1.setTo_user(toUser);
        offer1.setListing(listing2);
        offer1.setMessage("Offer 1");
        offer1.setOffer_status(0);

        Offer offer2 = new Offer();
        offer2.setFrom_user(toUser);
        offer2.setTo_user(fromUser);
        offer2.setListing(listing1);
        offer2.setMessage("Offer 2");
        offer2.setOffer_status(0);

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
