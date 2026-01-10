package com.stiropor.backend.repository;

import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TradeRepository extends JpaRepository<Trade,Integer> {
    Trade getByOffer(Offer offer);
}
