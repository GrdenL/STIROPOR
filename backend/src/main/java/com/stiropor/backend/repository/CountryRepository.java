package com.stiropor.backend.repository;

import com.stiropor.backend.model.Country;
import com.stiropor.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CountryRepository extends JpaRepository<Country,Integer>{
    Country findByCountryName(String countryName);
}
