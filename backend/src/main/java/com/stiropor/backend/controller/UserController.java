package com.stiropor.backend.controller;

import com.stiropor.backend.model.Country;
import com.stiropor.backend.model.Town;
import com.stiropor.backend.model.User;
import com.stiropor.backend.service.*;
import com.stiropor.backend.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    private final UserService userService;
    private final TownService townService;
    private final CountryService countryService;
    private final JwtUtil jwtUtil;
    private final NominatimService nominatimService;
    private final BCryptService bCryptService;
    @Value("${server.servlet.session.cookie.secure:true}")
    private boolean cookieSecure;
    @Value("${server.servlet.session.cookie.same-site:None}")
    private String cookieSameSite;

    public UserController(UserService userService, TownService townService, CountryService countryService, JwtUtil jwtUtil, NominatimService nominatimService, BCryptService bCryptService) {
        this.userService = userService;
        this.townService = townService;
        this.countryService = countryService;
        this.jwtUtil = jwtUtil;
        this.nominatimService = nominatimService;
        this.bCryptService = bCryptService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            String jwt = null;

            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals("jwt")) {
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
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            String email = jwtUtil.extractUsername(jwt);
            User user =  userService.findByEmail(email);

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user information");
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }


    @PostMapping("/login")
    @Deprecated
    public ResponseEntity<?> getByEmailAndPassword(@RequestParam String email,
                                                   @RequestParam String password,
                                                   HttpServletResponse response) {
        try {
            User user = userService.findByEmail(email);
            if (user != null && bCryptService.checkPassword(password, user.getPasswordHash())) {
                String token =  jwtUtil.generateToken(user.getEmail());
                Cookie cookie = new Cookie("jwt", token);
                cookie.setMaxAge(60 * 60 * 24);
                cookie.setPath("/");
                cookie.setHttpOnly(true);
                cookie.setSecure(cookieSecure);
                cookie.setAttribute("SameSite", cookieSameSite);
                response.addCookie(cookie);
                return ResponseEntity.ok(Map.of("user", user, "token", token));
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

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody Map<String, Object> updates, HttpServletRequest request) {
        try {
            String jwt = null;
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals("jwt")) jwt = cookie.getValue();
                }
            }

            if (jwt == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            String email = jwtUtil.extractUsername(jwt);
            User user = userService.findByEmail(email);

            if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

            if (updates.containsKey("username")) {
                user.setUsername((String) updates.get("username"));
            }
            if (updates.containsKey("description")) {
                user.setDescription((String) updates.get("description"));
            }
            if (updates.containsKey("location")) {
                String locationString = (String) updates.get("location");
                //NominatimService.LocationResponse result = nominatimService.geocode(locationString);
                //double lat = 0.0;
                //double lon = 0.0;
                //if(result != null) {
                //    lat = Double.parseDouble(result.lat);
                //    lon = Double.parseDouble(result.lon);
                //}
            }
            if (updates.containsKey("avatar")) {

            }

            User savedUser = userService.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed: " + e.getMessage());
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
    public ResponseEntity<?> registerUser(@RequestParam String email, @RequestParam String username, @RequestParam String password,  @RequestParam String location) {
        try {
            if (userService.findByEmail(email) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("User with this email already exists");
            }

            //NominatimService.LocationResponse result = nominatimService.geocode(location);

            double lat = 0.0;
            double lon = 0.0;

            //if(result != null) {
            //    lat = Double.parseDouble(result.lat);
            //    lon = Double.parseDouble(result.lon);
            //}
            //mozemo dodati da ne radi ako je neispravna lokacija kasnije

            Town town = townService.findByName("Unknown");
            if (town == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Default town not found.");
            }

            User savedUser = userService.save(new User(email, bCryptService.hashPassword(password), username, lat, lon, town));
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Clear authentication and security context
            SecurityContextHolder.clearContext();

            if (request.getSession(false) != null) {
                request.getSession(false).invalidate();
            }

            Cookie cookie = new Cookie("jwt", "");
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            cookie.setSecure(cookieSecure);
            cookie.setAttribute("SameSite", cookieSameSite);
            response.addCookie(cookie);

            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Logout failed");
        }
    }
}

