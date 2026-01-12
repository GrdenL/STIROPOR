package com.stiropor.backend.controller;

import com.stiropor.backend.dto.CreateOfferRequest;
import com.stiropor.backend.dto.OfferResponse;
import com.stiropor.backend.service.OfferService;
import com.stiropor.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/offers")
public class OfferController {

    @Autowired
    private OfferService offerService;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createOffer(
            @RequestBody CreateOfferRequest request,
            Authentication authentication) {
        System.out.println("createOffer");
        try {
            // Get current user ID from authentication
            Integer currentUserId = userService.findByEmail(authentication.getName()).getUserId();

            // Create the offer
            OfferResponse offer = offerService.createOffer(
                    request.getRequestedListingId(),
                    request.getOfferedListingIds(),
                    request.getMessage(),
                    currentUserId
            );
            System.out.println(offer);

            return ResponseEntity.status(HttpStatus.CREATED).body(offer);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create offer: " + e.getMessage());
        }
    }

    @GetMapping("/{offerId}")
    public ResponseEntity<?> getOfferById(
            @PathVariable Integer offerId,
            Authentication authentication) {

        try {
            Integer currentUserId = Integer.parseInt(authentication.getName());
            OfferResponse offer = offerService.getOfferById(offerId, currentUserId);
            return ResponseEntity.ok(offer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve offer");
        }
    }
}