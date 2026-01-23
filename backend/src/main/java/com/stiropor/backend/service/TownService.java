package com.stiropor.backend.service;

import com.stiropor.backend.model.Town;
import com.stiropor.backend.repository.TownRepository;
import org.springframework.stereotype.Service;

@Service
public class TownService {
    private final TownRepository townRepository;
    public TownService(TownRepository townRepository) {
        this.townRepository = townRepository;
    }

    public Town findByName(String Name) {
        return townRepository.findByTownName(Name);
    }
    public Town save(Town town) {
        return townRepository.save(town);
    }
    public void delete(Town town) {
        townRepository.delete(town);
    }
}
