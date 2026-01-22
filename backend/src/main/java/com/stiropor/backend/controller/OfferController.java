package com.stiropor.backend.controller;

import com.stiropor.backend.dto.CreateOfferRequest;
import com.stiropor.backend.dto.OfferResponse;
import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.User;
import com.stiropor.backend.model.OfferStatus;
import com.stiropor.backend.service.ListingService;
import com.stiropor.backend.service.NotificationService;
import com.stiropor.backend.service.OfferService;
import com.stiropor.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offers")
public class OfferController {
    @Value("${server.frontend}")
    private String frontendURL;

    @Autowired
    private OfferService offerService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ListingService listingService;

    @PostMapping
    public ResponseEntity<?> createOffer(
            @RequestBody CreateOfferRequest request,
            Authentication authentication) {
        try {
            // Get current user ID from authentication
            Integer currentUserId = resolveCurrentUserId(authentication);
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            // Validate request
            if (request.getRequestedListingId() == null) {
                return ResponseEntity.badRequest().body("Requested listing ID is required");
            }

            if (request.getOfferedListingIds() == null || request.getOfferedListingIds().isEmpty()) {
                return ResponseEntity.badRequest().body("At least one offered listing ID is required");
            }

            // Create the offer
            OfferResponse offer = offerService.createOffer(
                    request.getRequestedListingId(),
                    request.getOfferedListingIds(),
                    request.getMessage(),
                    currentUserId
            );

            User sender = resolveUserBySubject(authentication.getName());
            if (sender == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }
            User recipient = userService.findByUserId(offer.getToUserId());
            String games = "";
            List<Integer> offerListingIds = request.getOfferedListingIds();

            for (Integer id : offerListingIds) {
                games += listingService.findByListingId(id).getGame().getGameName() + ", ";
            }
            if (games.endsWith(", ")) {
                games = games.substring(0, games.length() - 2);
            }

            notificationService.createAndSendNotification(
                    recipient,
                    sender.getEmail(),
                    "OFFER_RECEIVED",
                    offer.getOfferId(),
                    "New offer for your game!",
                    "User " + sender.getUsername() + " is offering you: "+games+"\nfor your: "
                            + listingService.findByListingId(request.getRequestedListingId()).getGame().getGameName()
                            + "\n\n" + frontendURL + "/my-trades"
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(offer);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create offer: " + e.getMessage());
        }
    }

    @GetMapping("/{offerId}")
    public ResponseEntity<?> getOfferById(
            @PathVariable Integer offerId,
            Authentication authentication) {
        try {
            Integer currentUserId = resolveCurrentUserId(authentication);
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }
            OfferResponse offer = offerService.getOfferById(offerId, currentUserId);
            return ResponseEntity.ok(offer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve offer: " + e.getMessage());
        }
    }

    /**
     * Get all offers received by the current user (offers for their listings)
     */
    @GetMapping("/received")
    public ResponseEntity<?> getReceivedOffers(Authentication authentication) {
        try {
            Integer currentUserId = resolveCurrentUserId(authentication);
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }
            List<OfferResponse> offers = offerService.getReceivedOffers(currentUserId);
            return ResponseEntity.ok(offers != null ? offers : List.of());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve received offers: " + e.getMessage());
        }
    }

    /**
     * Get all offers sent by the current user (offers they created)
     */
    @GetMapping("/sent")
    public ResponseEntity<?> getSentOffers(Authentication authentication) {
        try {
            Integer currentUserId = resolveCurrentUserId(authentication);
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }
            List<OfferResponse> offers = offerService.getSentOffers(currentUserId);
            return ResponseEntity.ok(offers != null ? offers : List.of());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve sent offers: " + e.getMessage());
        }
    }

    /**
     * Get all offers related to the current user (both sent and received)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyOffers(Authentication authentication) {
        try {
            Integer currentUserId = resolveCurrentUserId(authentication);
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }
            List<OfferResponse> offers = offerService.getAllUserOffers(currentUserId);
            return ResponseEntity.ok(offers != null ? offers : List.of());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve offers: " + e.getMessage());
        }
    }

    /**
     * Update the status of an offer (accept, decline, cancel)
     * Status parameter can be integer (0-3) or string (PENDING, ACCEPTED, DECLINED, CANCELLED)
     */
    @PatchMapping("/{offerId}/status")
    public ResponseEntity<?> updateOfferStatus(
            @PathVariable Integer offerId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String statusString,
            Authentication authentication) {
        try {
            Integer currentUserId = resolveCurrentUserId(authentication);
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            // Determine the status value
            Integer statusValue = null;

            if (status != null) {
                // Use integer status directly
                statusValue = status;
            } else if (statusString != null) {
                // Convert string status to integer
                try {
                    OfferStatus offerStatus = OfferStatus.valueOf(statusString.toUpperCase());
                    statusValue = offerStatus.ordinal();
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest()
                            .body("Invalid status string. Must be one of: PENDING, ACCEPTED, DECLINED, CANCELLED");
                }
            } else {
                return ResponseEntity.badRequest()
                        .body("Either 'status' (integer) or 'statusString' (string) parameter is required");
            }

            // Validate status value
            if (statusValue < 0 || statusValue > 3) {
                return ResponseEntity.badRequest()
                        .body("Invalid status value. Must be between 0 and 3 (0=PENDING, 1=ACCEPTED, 2=DECLINED, 3=CANCELLED)");
            }

            OfferResponse updatedOffer = offerService.updateOfferStatus(offerId, statusValue, currentUserId);
            return ResponseEntity.ok(updatedOffer);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update offer status: " + e.getMessage());
        }
    }

    /**
     * Cancel an offer (only by the user who created it)
     */
    @DeleteMapping("/{offerId}")
    public ResponseEntity<?> cancelOffer(
            @PathVariable Integer offerId,
            Authentication authentication) {
        try {
            Integer currentUserId = resolveCurrentUserId(authentication);
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }


            User sender = resolveUserBySubject(authentication.getName());
            if (sender == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }
            User recipient = userService.findByUserId(offerService.getOfferById(offerId, currentUserId).getToUserId());

            notificationService.createAndSendNotification(
                    recipient,
                    sender.getEmail(),
                    "OFFER_CANCELLED",
                    offerId,
                    "An offer for you has been cancelled!",
                    "User " + sender.getUsername() + " has cancelled their offer!"
            );

            offerService.cancelOffer(offerId, currentUserId);


            return ResponseEntity.ok("gas");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to cancel offer: " + e.getMessage());
        }
    }

    /**
     * Accept an offer (only by the owner of the requested listing)
     */
    @PostMapping("/{offerId}/accept")
    public ResponseEntity<?> acceptOffer(
            @PathVariable Integer offerId,
            Authentication authentication) {
        try {
            Integer currentUserId = resolveCurrentUserId(authentication);
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            User sender = resolveUserBySubject(authentication.getName());
            if (sender == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }
            User recipient = userService.findByUserId(offerService.getOfferById(offerId, currentUserId).getFromUserId());

            notificationService.createAndSendNotification(
                    recipient,
                    sender.getEmail(),
                    "OFFER_ACCEPTED",
                    offerId,
                    "Your offer has been accepted!",
                    "User " + sender.getUsername() + " has accepted your offer!"
            );


            OfferResponse acceptedOffer = offerService.acceptOffer(offerId, currentUserId);
            return ResponseEntity.ok(acceptedOffer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to accept offer: " + e.getMessage());
        }
    }

    /**
     * Decline an offer (only by the owner of the requested listing)
     */
    @PostMapping("/{offerId}/decline")
    public ResponseEntity<?> declineOffer(
            @PathVariable Integer offerId,
            Authentication authentication) {
        try {
            Integer currentUserId = resolveCurrentUserId(authentication);
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            User sender = resolveUserBySubject(authentication.getName());
            if (sender == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }
            User recipient = userService.findByUserId(offerService.getOfferById(offerId, currentUserId).getFromUserId());

            notificationService.createAndSendNotification(
                    recipient,
                    sender.getEmail(),
                    "OFFER_DECLINED",
                    offerId,
                    "Your offer has been declined!",
                    "User " + sender.getUsername() + " has declined your offer!"
            );


            OfferResponse declinedOffer = offerService.declineOffer(offerId, currentUserId);
            return ResponseEntity.ok(declinedOffer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to decline offer: " + e.getMessage());
        }
    }

    private Integer resolveCurrentUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        User user = resolveUserBySubject(authentication.getName());
        return user != null ? user.getUserId() : null;
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
}
