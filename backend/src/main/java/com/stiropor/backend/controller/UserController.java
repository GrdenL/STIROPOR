package com.stiropor.backend.controller;

import com.stiropor.backend.model.Country;
import com.stiropor.backend.model.Town;
import com.stiropor.backend.model.User;
import com.stiropor.backend.service.*;
import com.stiropor.backend.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    @GetMapping
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
                cookie.setSecure(false);                                 //ZAMIJENI NA TRUE PRIJE PUSHA NA MAIN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                cookie.setAttribute("SameSite", "Lax");          //ZAMIJENI NA NONE PRIJE PUSHA NA MAIN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

            Town town = townService.findByName(location.split(",")[2]);
            if(town == null) {
                Country country = countryService.findById(location.split(",")[3]);
                if (country == null){
                    country = new Country(location.split(",")[3]);
                }
                town = new Town(location.split(",")[2], country);
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

            Cookie cookie = new Cookie("jwt", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);                           //ZAMIJENI NA TRUE PRIJE PUSHA NA MAIN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            cookie.setPath("/");
            cookie.setMaxAge(0);
            cookie.setAttribute("SameSite", "Lax");          //ZAMIJENI NA NONE PRIJE PUSHA NA MAIN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            response.addCookie(cookie);

            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Logout failed");
        }
    }
}
