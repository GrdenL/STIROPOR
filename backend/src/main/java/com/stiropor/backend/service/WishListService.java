package com.stiropor.backend.service;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.User;
import com.stiropor.backend.model.WishList;
import com.stiropor.backend.model.WishListId;
import com.stiropor.backend.repository.WishListRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishListService {
    private final WishListRepository wishListRepository;

    public WishListService(WishListRepository wishListRepository) {
        this.wishListRepository = wishListRepository;
    }
    public WishList save(WishList wishList) {
        return wishListRepository.save(wishList);
    }
    public void delete(WishList wishList) {
        wishListRepository.delete(wishList);
    }
    public List<Game> findByUser(User user) {
        return wishListRepository.findGamesByUser(user);
    }
    public List<Game> findByUserId(Integer userId) {
        return wishListRepository.findGamesByUserId(userId);
    }
    public List<User> findByGameId(Integer gameId) {
        return wishListRepository.findUsersByGameId(gameId);
    }
    public List<User> findByGame(Game game) {
        return wishListRepository.findUsersByGame(game);
    }
}
