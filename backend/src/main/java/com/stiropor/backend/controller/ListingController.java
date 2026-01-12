package com.stiropor.backend.controller;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Listing;
import com.stiropor.backend.model.Media;
import com.stiropor.backend.model.User;
import com.stiropor.backend.service.GameService;
import com.stiropor.backend.service.ListingService;
import com.stiropor.backend.service.MediaService;
import com.stiropor.backend.service.UserService;
import com.stiropor.backend.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/listings")
public class ListingController {
    private final ListingService listingService;
    private final GameService gameService;
    private final MediaService mediaService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public ListingController(ListingService listingService,
                             GameService gameService,
                             MediaService mediaService,
                             UserService userService,
                             JwtUtil jwtUtil) {
        this.listingService = listingService;
        this.gameService = gameService;
        this.mediaService = mediaService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
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
//        media = mediaService.save(new Media("random media", user));
        if (body.mediaHref != null && !body.mediaHref.isBlank()) {
            media = mediaService.save(new Media(body.mediaHref, user));
        }
        Game game = resolveGame(body, media);
        if (game == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Game not found");
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Listing> deleteListingById(@PathVariable Integer id) {
        listingService.deleteByListingId(id);
        return ResponseEntity.ok(new Listing());
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

        // Fetch listings for game excluding current user
        List<Listing> listings = listingService.findAllByGameIdExcludingUser(gameId, currentUser);
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

            Game created = new Game(
                    body.gameName.trim(),
                    "Unknown",
                    "1-4",
                    0,
                    0,
                    0,
                    media
            );
            return gameService.save(created);
        }
        return null;
    }

    private User getAuthenticatedUser(HttpServletRequest request) {
        String jwt = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                }
            }
        }
        if (jwt == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ") && authHeader.length() > 7) {
                jwt = authHeader.substring(7);
            }
        }
        if (jwt == null) {
            return null;
        }

        String email = jwtUtil.extractUsername(jwt);
        return userService.findByEmail(email);
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
