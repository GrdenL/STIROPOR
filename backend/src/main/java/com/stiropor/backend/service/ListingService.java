package com.stiropor.backend.service;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Listing;
import com.stiropor.backend.model.User;
import com.stiropor.backend.repository.ListingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListingService {
    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public Listing save(Listing listing) {
        return listingRepository.save(listing);
    }
    public void delete(Listing listing) {
        listingRepository.delete(listing);
    }
    public List<Listing> findAllByGame(Game game) {
        return listingRepository.getAllByGame(game);
    }
    public List<Listing> findAllByUser(User user) {
        return listingRepository.getAllByUser(user);
    }
    public List<Listing> findAll() {
        return listingRepository.findAll();
    }
    public List<Listing> findAllByGameAndUser(Game game, User user) {
        return listingRepository.getAllByUserAndGame(user, game);
    }
}
