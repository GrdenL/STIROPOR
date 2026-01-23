package com.stiropor.backend.controller;

import com.stiropor.backend.model.Country;
import com.stiropor.backend.model.Town;
import com.stiropor.backend.model.User;
import com.stiropor.backend.service.BCryptService;
import com.stiropor.backend.service.TownService;
import com.stiropor.backend.service.UserService;
import com.stiropor.backend.utils.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private TownService townService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private BCryptService bCryptService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private UserController userController;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("test@example.com", "hashedPassword", "testUser",
                0.0, 0.0, new Town("Unknown", new Country("Unknown")));
    }

    @Test
    void testGetCurrentUser_WithJwtCookie() {
        Cookie cookie = new Cookie("jwt", "mockJwt");
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        when(jwtUtil.extractUsername("mockJwt")).thenReturn("test@example.com");
        when(userService.findByEmail("test@example.com")).thenReturn(testUser);

        ResponseEntity<?> responseEntity = userController.getCurrentUser(request);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(testUser, responseEntity.getBody());
    }

    @Test
    void testGetCurrentUser_Unauthorized() {
        when(request.getCookies()).thenReturn(null);
        when(request.getHeader("Authorization")).thenReturn(null);

        ResponseEntity<?> responseEntity = userController.getCurrentUser(request);

        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
    }

    @Test
    void testLogin_Success() {
        when(userService.findByEmail("test@example.com")).thenReturn(testUser);
        when(bCryptService.checkPassword("password", "hashedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("test@example.com")).thenReturn("mockJwt");

        ResponseEntity<?> responseEntity = userController.getByEmailAndPassword("test@example.com", "password", response);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());

        assertNotNull(responseEntity.getBody());
        assertTrue(responseEntity.getBody() instanceof Map);
        Map<?, ?> body = (Map<?, ?>) responseEntity.getBody();

        assertEquals(testUser, body.get("user"));
        assertEquals("mockJwt", body.get("token"));
        verify(response, times(1)).addCookie(any(Cookie.class));
    }

    @Test
    void testLogin_InvalidCredentials() {
        when(userService.findByEmail("test@example.com")).thenReturn(testUser);
        when(bCryptService.checkPassword("wrongPassword", "hashedPassword")).thenReturn(false);

        ResponseEntity<?> responseEntity = userController.getByEmailAndPassword("test@example.com", "wrongPassword", response);

        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
    }

    @Test
    void testRegisterUser_Success() {
        when(userService.findByEmail("test@example.com")).thenReturn(null);
        when(townService.findByName("Unknown")).thenReturn(new Town("Unknown", new Country("Unknown")));
        when(bCryptService.hashPassword("password")).thenReturn("hashedPassword");
        when(userService.save(any(User.class))).thenReturn(testUser);

        ResponseEntity<?> responseEntity = userController.registerUser("test@example.com", "testUser", "password");

        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertEquals(testUser, responseEntity.getBody());
    }

    @Test
    void testRegisterUser_EmailExists() {
        when(userService.findByEmail("test@example.com")).thenReturn(testUser);

        ResponseEntity<?> responseEntity = userController.registerUser("test@example.com", "testUser", "password");

        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
    }

    @Test
    void testLogoutUser_Success() {
        ResponseEntity<?> responseEntity = userController.logoutUser(request, response);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        verify(response, times(1)).addCookie(any(Cookie.class));
    }
}
