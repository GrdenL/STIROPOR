package com.stiropor.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "genres")

public class Genre {
	@Id
    	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "genre_Id", nullable = false)
    	private Integer genreId;

	@Column(name = "genre_name", nullable = false)
	private String genreName;

	
	@ManyToMany(mappedBy = "genres")
	@JsonIgnore
	private List<Game> games = new ArrayList<>();

	@ManyToMany(mappedBy = "interestedGenres")
	@JsonIgnore
	private List<User> interestedUsers = new ArrayList<>();

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

	public List<Game> getGames() {
		return games;
	}

	public void setGames(List<Game> games) {
		this.games = games;
	}

	public List<User> getInterestedUsers() {
		return interestedUsers;
	}

	public void setInterestedUsers(List<User> interestedUsers) {
		this.interestedUsers = interestedUsers;
	}



}
