package com.stiropor.backend.controller;

import com.stiropor.backend.model.User;
import com.stiropor.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

            if (!authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String email = oAuth2User.getAttribute("email");
            User user = userService.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user information");
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    // SECURITY WARNING: Remove this endpoint in production!
    // It exposes password verification logic and user data
    @PostMapping("/login")
    @Deprecated
    public ResponseEntity<?> getByEmailAndPassword(@RequestParam String email,
                                                   @RequestParam String password_hash) {
        try {
            User user = userService.findByEmail(email);
            if (user != null && password_hash.equals(user.getPasswordHash())) {
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> getByEmail(@RequestParam String email) {
        try {
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error searching for user");
        }
    }

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        try {
            // Add validation to ensure users can only update their own data
            User updatedUser = userService.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user");
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteByEmail(@RequestParam String email) {
        try {
            // Add authorization check to ensure users can only delete their own account
            // or admin privileges
            userService.deleteByEmail(email);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting user");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (userService.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("User with this email already exists");
            }

            User savedUser = userService.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed");
        }
    }
}