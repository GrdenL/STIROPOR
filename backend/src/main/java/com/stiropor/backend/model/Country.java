package com.stiropor.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "country")

public class Country {
	@Id
    	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "country_id", nullable = false)
    	private Integer countryId;

	@Column(name = "country_name", nullable = false)
	private String countryName;

	public Country() {

	}

	public Country(String countryName) {
		this.countryName = countryName;
	}


	public Integer getCountryId() {
		return countryId;
	}

	public void setCountryId(Integer countryId) {
		this.countryId = countryId;
	}

	public String getCountryName() {
		return countryName;
	}

	public void setCountryName(String countryName) {
		this.countryName = countryName;
	}


}