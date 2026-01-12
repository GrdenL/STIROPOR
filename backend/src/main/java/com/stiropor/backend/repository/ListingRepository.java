package com.stiropor.backend.repository;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Listing;
import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Integer> {
    Listing findByListingId(Integer id);
    List<Listing> findAllByGame(Game game);
    List<Listing> findAllByUser(User user);
    List<Listing> findAllByUserAndGame(User user, Game game);
    List<Listing> findAllByGame_GameIdAndUserNot(Integer gameId, User user);
    @Transactional
    void deleteByListingId(Integer id);
}
