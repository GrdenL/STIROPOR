package com.stiropor.backend.controller;

import com.stiropor.backend.dto.OfferResponse;
import com.stiropor.backend.model.*;
import com.stiropor.backend.service.*;
import com.stiropor.backend.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import io.jsonwebtoken.JwtException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/listings")
public class ListingController {
    private final ListingService listingService;
    private final GameService gameService;
    private final MediaService mediaService;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final NotificationService notificationService;
    private final WishListService wishListService;
    private final OfferService offerService;
    private final OfferItemService offerItemService;

    @Value("${server.frontend}")
    private String frontendURL;

    public ListingController(ListingService listingService,
                             GameService gameService,
                             MediaService mediaService,
                             UserService userService,
                             JwtUtil jwtUtil,
                             NotificationService notificationService,
                             WishListService wishListService, OfferService offerService, OfferItemService offerItemService) {
        this.listingService = listingService;
        this.gameService = gameService;
        this.mediaService = mediaService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.notificationService = notificationService;
        this.wishListService = wishListService;
        this.offerService = offerService;
        this.offerItemService = offerItemService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyListings(HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Listing> listings = listingService.findAllByUser(user);
        List<ListingResponse> response = listings.stream()
                .map(ListingResponse::fromListing)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createListing(@RequestBody ListingCreateRequest body,
                                           HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if (body == null || body.condition == null || body.condition.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Condition is required");
        }

        Media media = null;
        //media = mediaService.save(new Media("random media", user));
        if (body.mediaHref != null && !body.mediaHref.isBlank()) {
            media = mediaService.save(new Media(body.mediaHref, user));
        }
        Game game = resolveGame(body, media);
        if (game == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Game not found");
        }

        List<User> wishListUsers = wishListService.findByGame(game);
        if (!wishListUsers.isEmpty()) {
            for (User wishUser : wishListUsers){
                if (!wishUser.getUserId().equals(user.getUserId())){
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                    String timestamp = LocalDateTime.now().format(formatter);
                    notificationService.sendWishListEmail(
                            wishUser.getEmail(),
                            "[" + timestamp + "] The game you wishlisted is available!",
                            "The user " + user.getUsername() + " has listed your wishlisted game: " +
                                    game.getGameName() + "!\n\n" + frontendURL + "/games/" + game.getGameId()
                    );
                }

            }
        }

        Listing listing = new Listing(body.condition, true, body.description, user, game, media);
        Listing saved = listingService.save(listing);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ListingResponse.fromListing(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Listing> getListingById(@PathVariable Integer id) {


        Listing listing = listingService.findByListingId(id);
        return ResponseEntity.ok(listing);
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Listing> deleteListingById(@PathVariable Integer id) {
        Listing listing = listingService.findByListingId(id);

        Set<Offer> offers = new HashSet<>();
        List<Offer> offersTargetListing = offerService.findByListingId(listing.getListingId());
        List<OfferItem> offerItemsListing = offerItemService.findByListingId(listing.getListingId());
        if (offersTargetListing != null) { offers.addAll(offersTargetListing); }
        if ( offerItemsListing != null) {
            for  (OfferItem offerItem : offerItemsListing) {
                offers.add(offerItem.getOffer());
            }
        }
        if (offers.isEmpty()) {
            listingService.delete(listing);
            listing = new  Listing();
        }else{
            for (Offer offer : offers) {
                if(offer.getOffer_status() == 0){
                    User sender = userService.findByUserId(listing.getUser().getUserId());
                    if(offer.getFrom_user().getUserId().equals(listing.getUser().getUserId())){
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
                        offerService.save(offer);
                    }
                }
            }
            listing.setIsActive(false);
            listingService.save(listing);
        }


        return ResponseEntity.ok(listing);
    }


    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<Listing>> getListingsByGameId(
            @PathVariable Integer gameId,
            HttpServletRequest request) {

        // Get current user from custom method
        User currentUser = getAuthenticatedUser(request);
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }

        // Fetch listings for game (including current user)
        List<Listing> listings = listingService.findAllByGameId(gameId);
        System.out.println("listings size: " + listings.size());

        return ResponseEntity.ok(listings);
    }



    private Game resolveGame(ListingCreateRequest body, Media media) {
        if (body.gameId != null) {
            Optional<Game> byId = gameService.findById(body.gameId);
            if (byId.isPresent()) {
                return byId.get();
            }
        }
        if (body.gameName != null && !body.gameName.isBlank()) {
            Game existing = gameService.getByGameName(body.gameName);
            if (existing != null) {
                return existing;
            }

        }
        return null;
    }

    private User getAuthenticatedUser(HttpServletRequest request) {
        return resolveUserFromRequest(request);
    }

    private User resolveUserFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ") && authHeader.length() > 7) {
            User user = resolveUserFromToken(authHeader.substring(7));
            if (user != null) {
                return user;
            }
        }

        if (request.getCookies() == null) {
            return null;
        }

        for (Cookie cookie : request.getCookies()) {
            if (!"jwt".equals(cookie.getName())) {
                continue;
            }
            User user = resolveUserFromToken(cookie.getValue());
            if (user != null) {
                return user;
            }
        }

        return null;
    }

    private User resolveUserFromToken(String jwt) {
        String subject = safelyExtractSubject(jwt);
        if (subject == null) {
            return null;
        }

        return resolveUserBySubject(subject);
    }

    private String safelyExtractSubject(String jwt) {
        if (jwt == null || jwt.isBlank()) {
            return null;
        }
        try {
            return jwtUtil.extractUsername(jwt);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    private User resolveUserBySubject(String subject) {
        User user = userService.findByEmail(subject);
        if (user != null) {
            return user;
        }

        user = userService.findByEmailIgnoreCase(subject);
        if (user != null) {
            return user;
        }

        user = userService.findByGoogleId(subject);
        if (user != null) {
            return user;
        }

        Integer userId = parseUserId(subject);
        if (userId != null) {
            return userService.findByUserId(userId);
        }

        return null;
    }

    private Integer parseUserId(String subject) {
        try {
            return Integer.valueOf(subject);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static class ListingCreateRequest {
        public Integer gameId;
        public String gameName;
        public String condition;
        public String description;
        public String mediaHref;
    }

    private static class ListingResponse {
        public Integer listingId;
        public String condition;
        public Boolean isActive;
        public String description;
        public Integer gameId;
        public String gameName;
        public String mediaHref;

        public static ListingResponse fromListing(Listing listing) {
            ListingResponse response = new ListingResponse();
            response.listingId = listing.getListingId();
            response.condition = listing.getCondition();
            response.isActive = listing.getIsActive();
            response.description = listing.getDescription();
            if (listing.getGame() != null) {
                response.gameId = listing.getGame().getGameId();
                response.gameName = listing.getGame().getGameName();
            }
            if (listing.getMedia() != null) {
                response.mediaHref = listing.getMedia().getHref();
            }
            return response;
        }
    }
}
