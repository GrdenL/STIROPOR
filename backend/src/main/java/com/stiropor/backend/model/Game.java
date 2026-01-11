package com.stiropor.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "games")

public class Game{
	@Id
    	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "gameId", nullable = false)
	private Integer gameId;

	@Column(name = "gameName", nullable = false)
	private String gameName;

	@Column(name = "publisher", nullable = false)
	private String publisher;

	@Column(name = "maxMinPlayers", nullable = false)
	private String maxMinPlayers;

	@Column(name = "avgPlayTime", nullable = false)
	private Integer avgPlayTime;

	@Column(name = "complexity", nullable = false)
	private Integer complexity;

	@Column(name = "yearPublished", nullable = false)
	private Integer yearPublished;

	@ManyToOne(optional = true)
	@JoinColumn(name = "mediaId")
	private Media media;

	
	@ManyToMany
	@JoinTable(
		name = "isGenre",
		joinColumns = @JoinColumn(name = "gameId"),
		inverseJoinColumns = @JoinColumn(name = "genreId")
	)
	private List<Genre> genres = new ArrayList<>();

	@ManyToMany(mappedBy = "wishlist")
	private List<User> wishedByUsers = new ArrayList<>();

	public Game() {

	}


	public Game(String gameName, String publisher, String maxMinPlayers, 
			Integer avgPlayTime, Integer complexity, Integer yearPublished, Media media) {
		this.gameName = gameName;
		this.publisher = publisher;
		this.maxMinPlayers = maxMinPlayers;
		this.avgPlayTime = avgPlayTime;
		this.complexity = complexity;
		this.yearPublished = yearPublished;
		this.media = media;
	}


	public Integer getGameId() {
		return gameId;
	}

	public void setGameId(Integer gameId) {
		this.gameId = gameId;
	}

	public String getGameName() {
		return gameName;
	}

	public void setGameName(String gameName) {
		this.gameName = gameName;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public String getMaxMinPlayers() {
		return maxMinPlayers;
	}

	public void setMaxMinPlayers(String maxMinPlayers) {
		this.maxMinPlayers = maxMinPlayers;
	}

	public Integer getAvgPlayTime() {
		return avgPlayTime;
	}

	public void setAvgPlayTime(Integer avgPlayTime) {
		this.avgPlayTime = avgPlayTime;
	}

	public Integer getComplexity() {
		return complexity;
	}

	public void setComplexity(Integer complexity) {
		this.complexity = complexity;
	}

	public Integer getYearPublished() {
		return yearPublished;
	}

	public void setYearPublished(Integer yearPublished) {
		this.yearPublished = yearPublished;
	}

	public Media getMedia() {
		return media;
	}

	public void setMedia(Media media) {
		this.media = media;
	}

	public List<Genre> getGenres() {
		return genres;
	}

	public void setGenres(List<Genre> genres) {
		this.genres = genres;
	}

	public List<User> getWishedByUsers() {
		return wishedByUsers;
	}

	public void setWishedByUsers(List<User> wishedByUsers) {
		this.wishedByUsers = wishedByUsers;
	}


}
