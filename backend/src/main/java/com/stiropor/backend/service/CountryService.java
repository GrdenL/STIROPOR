package com.stiropor.backend.service;

import com.stiropor.backend.model.Country;
import com.stiropor.backend.repository.CountryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryService {
    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public void save(Country country) {
        countryRepository.save(country);
    }
    public List<Country> findAll() {
        return countryRepository.findAll();
    }
    public void delete(Country country) {
        countryRepository.delete(country);
    }
    public Country findById(String countryName) {
        return countryRepository.findByCountryName(countryName);
    }
}
