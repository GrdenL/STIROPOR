package com.stiropor.backend.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtUtilTest {

    @Test
    void generateToken_containsSubject_andValidates() {
        JwtUtil jwtUtil = new JwtUtil();
        String username = "user@example.com";

        String token = jwtUtil.generateToken(username);

        assertEquals(username, jwtUtil.extractUsername(token));
        assertTrue(jwtUtil.isTokenValid(token, username));
        assertFalse(jwtUtil.isTokenValid(token, "other@example.com"));
    }
}
