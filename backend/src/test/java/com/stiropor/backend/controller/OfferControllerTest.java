package com.stiropor.backend.controller;

import com.stiropor.backend.dto.CreateOfferRequest;
import com.stiropor.backend.dto.OfferResponse;
import com.stiropor.backend.service.OfferService;
import com.stiropor.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OfferControllerTest {

    @Mock
    private OfferService offerService;

    @Mock
    private UserService userService;

    @InjectMocks
    private OfferController offerController;

    @Mock
    private Authentication authentication;

    private OfferResponse testOffer;

    @BeforeEach
    void setUp() {
        testOffer = new OfferResponse();
        testOffer.setOfferId(1);
        testOffer.setTargetListingId(10);
        testOffer.setOfferedListingIds(List.of(20, 30));
        testOffer.setMessage("Test message");
    }

    @Test
    void testCreateOffer_Success() {
        CreateOfferRequest request = new CreateOfferRequest();
        request.setRequestedListingId(10);
        request.setOfferedListingIds(List.of(20, 30));
        request.setMessage("Test message");

        // Mock authentication and user
        when(authentication.getName()).thenReturn("user@example.com");
        when(userService.findByEmail("user@example.com")).thenReturn(new com.stiropor.backend.model.User("user@example.com", null, null, 1.0,0.0,null));

        // Mock offer service
        when(offerService.createOffer(10, List.of(20,30), "Test message", 1)).thenReturn(testOffer);

        ResponseEntity<?> response = offerController.createOffer(request, authentication);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(testOffer, response.getBody());
        verify(offerService, times(1)).createOffer(10, List.of(20,30), "Test message", 1);
    }

    @Test
    void testCreateOffer_BadRequest() {
        CreateOfferRequest request = new CreateOfferRequest();
        request.setRequestedListingId(10);
        request.setOfferedListingIds(List.of(20, 30));
        request.setMessage("Test message");

        when(authentication.getName()).thenReturn("user@example.com");
        when(userService.findByEmail("user@example.com")).thenReturn(new com.stiropor.backend.model.User("user@example.com", null, null, 1.0,0.0,null));
        when(offerService.createOffer(anyInt(), anyList(), anyString(), anyInt())).thenThrow(new IllegalArgumentException("Invalid offer"));

        ResponseEntity<?> response = offerController.createOffer(request, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid offer", response.getBody());
    }

    @Test
    void testCreateOffer_InternalServerError() {
        CreateOfferRequest request = new CreateOfferRequest();
        request.setRequestedListingId(10);
        request.setOfferedListingIds(List.of(20, 30));
        request.setMessage("Test message");

        when(authentication.getName()).thenReturn("user@example.com");
        when(userService.findByEmail("user@example.com")).thenReturn(new com.stiropor.backend.model.User("user@example.com", null, null, 1.0,0.0,null));
        when(offerService.createOffer(anyInt(), anyList(), anyString(), anyInt())).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = offerController.createOffer(request, authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(((String)response.getBody()).contains("DB error"));
    }

    @Test
    void testGetOfferById_Success() {
        when(authentication.getName()).thenReturn("1"); // userId as string
        when(offerService.getOfferById(1,1)).thenReturn(testOffer);

        ResponseEntity<?> response = offerController.getOfferById(1, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testOffer, response.getBody());
    }

    @Test
    void testGetOfferById_BadRequest() {
        when(authentication.getName()).thenReturn("1");
        when(offerService.getOfferById(1,1)).thenThrow(new IllegalArgumentException("Offer not valid"));

        ResponseEntity<?> response = offerController.getOfferById(1, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Offer not valid", response.getBody());
    }

    @Test
    void testGetOfferById_InternalServerError() {
        when(authentication.getName()).thenReturn("1");
        when(offerService.getOfferById(1,1)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = offerController.getOfferById(1, authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(((String)response.getBody()).contains("DB error"));
    }
}
