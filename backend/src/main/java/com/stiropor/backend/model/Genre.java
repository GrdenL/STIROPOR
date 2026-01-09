package com.stiropor.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "genres")

public class Genre {
	@Id
    	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "genreId", nullable = false)
    	private Integer genreId;

	@Column(name = "genreName", nullable = false)
	private String genreName;

	public Genre(){

	}


	public Genre(String genreName) {
		this.genreName = genreName;
	}


	public Integer getGenreId() {
		return genreId;
	}

	public void setGenreId(Integer genreId) {
		this.genreId = genreId;
	}

	public String getGenreName() {
		return genreName;
	}

	public void setGenreName(String genreName) {
		this.genreName = genreName;
	}




}