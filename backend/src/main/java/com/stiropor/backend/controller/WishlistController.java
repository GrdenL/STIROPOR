package com.stiropor.backend.controller;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.User;
import com.stiropor.backend.model.WishList;
import com.stiropor.backend.model.WishListId;
import com.stiropor.backend.service.WishListService;
import com.stiropor.backend.service.UserService;
import com.stiropor.backend.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishListService wishListService;
    private final UserService userService;
    private final GameService gameService;

    public WishlistController(
            WishListService wishListService,
            UserService userService,
            GameService gameService) {
        this.wishListService = wishListService;
        this.userService = userService;
        this.gameService = gameService;
    }

    // Helper method to get current user from authentication
    private User getCurrentUser(Authentication authentication) {
        String subject = authentication.getName();


        System.out.println("Current User: " + subject);

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

    @GetMapping("/my-wishlist")
    public ResponseEntity<List<Game>> getMyWishlist(Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            List<Game> wishlist = wishListService.findByUser(user);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/add/{gameId}")
    public ResponseEntity<WishList> addToWishlist(
            @PathVariable Integer gameId,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            System.out.println("My fucking user" + user.getUserId());
            // Get game using GameService
            Optional<Game> gameOptional = gameService.findById(gameId);

            if (gameOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            Game game = gameOptional.get();

            // Check if already exists in wishlist
            List<Game> userWishlist = wishListService.findByUser(user);
            boolean alreadyExists = userWishlist.stream()
                    .anyMatch(g -> g.getGameId().equals(gameId));

            if (alreadyExists) {
                return ResponseEntity.badRequest().body(null);
            }

            // Create new wishlist entry
            System.out.println(user);
            System.out.println(game);
            WishList wishList = new WishList(user, game);
            System.out.println(wishList);

            WishList savedWishList = wishListService.save(wishList);
            return ResponseEntity.ok(savedWishList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/remove/{gameId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Integer gameId,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            // Get all games in user's wishlist
            List<Game> userWishlist = wishListService.findByUser(user);

            // Find the game to remove
            Optional<Game> gameToRemove = userWishlist.stream()
                    .filter(g -> g.getGameId().equals(gameId))
                    .findFirst();

            if (gameToRemove.isPresent()) {
                // Get the game entity
                Optional<Game> gameOptional = gameService.findById(gameId);
                if (!gameOptional.isPresent()) {
                    return ResponseEntity.notFound().build();
                }
                Game game = gameOptional.get();

                // Create the WishListId to identify which entry to delete
                WishListId wishListId = new WishListId();
                wishListId.setUserId(user.getUserId());
                wishListId.setGameId(gameId);

                // Create a WishList object with the ID to delete
                WishList wishListToDelete = new WishList();
                wishListToDelete.setId(wishListId);
                wishListToDelete.setUser(user);
                wishListToDelete.setGame(game);

                wishListService.delete(wishListToDelete);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/check/{gameId}")
    public ResponseEntity<Boolean> isGameInWishlist(
            @PathVariable Integer gameId,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            List<Game> userWishlist = wishListService.findByUser(user);

            boolean isInWishlist = userWishlist.stream()
                    .anyMatch(g -> g.getGameId().equals(gameId));

            return ResponseEntity.ok(isInWishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(false);
        }
    }

    // Additional endpoint to get wishlist by user ID (for admin purposes)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Game>> getWishlistByUserId(@PathVariable Integer userId) {
        try {
            // Get user by ID
            User user = userService.findByUserId(userId);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            List<Game> wishlist = wishListService.findByUser(user);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Additional endpoint to get users who wishlisted a game
    @GetMapping("/game/{gameId}/users")
    public ResponseEntity<List<User>> getUsersByGameId(@PathVariable Integer gameId) {
        try {
            List<User> users = wishListService.findByGameId(gameId);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}