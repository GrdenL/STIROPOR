package com.stiropor.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "town")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Town {
	@Id
    	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "townId", nullable = false)
    	private Integer townId;

	@Column(name = "townName", nullable = false)
	private String townName;

	@ManyToOne
	@JoinColumn(name = "countryId", nullable = false)
	private Country country;

	public Town() {

	}


	public Town(String townName, Country country) {
		this.townName = townName;
		this.country = country;
	}


	public Integer getTownId() {
		return townId;
	}

	public void setTownId(Integer townId) {
		this.townId = townId;
	}

	public String getTownName() {
		return townName;
	}

	public void setTownName(String townName) {
		this.townName = townName;
	}

	public Country getCountry() {
		return country;
	}

	public void setCountry(Country country) {
		this.country = country;
	}


	

}
