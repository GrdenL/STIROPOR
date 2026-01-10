package com.stiropor.backend.service;

import com.stiropor.backend.model.Offer;
import com.stiropor.backend.model.Trade;
import com.stiropor.backend.repository.TradeRepository;
import org.springframework.stereotype.Service;

@Service
public class TradeService {
    private final TradeRepository tradeRepository;
    public TradeService(TradeRepository tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    public Trade findByOffer(Offer offer) {
        return tradeRepository.getByOffer(offer);
    }
    public void delete(Trade trade) {
        tradeRepository.delete(trade);
    }
    public Trade save(Trade trade) {
        return tradeRepository.save(trade);
    }
}
