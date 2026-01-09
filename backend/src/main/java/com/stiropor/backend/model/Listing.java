package com.stiropor.backend.model;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "listing")
public class Listing{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "listingId", nullable = false)
	private Integer listingId;

	@Column(name = "condition", nullable = false)
	private String condition;

	@Column(name = "isActive", nullable = false)
	private Boolean isActive;

	@Column(name = "created_at", nullable = false)
    	private Date createdAt;
	
	@Column(name = "description")
	private String description;

	@ManyToOne
	@JoinColumn(name = "userId", nullable = false)
	private User user;

	@ManyToOne
	@JoinColumn(name = "gameId", nullable = false)
	private Game game;

	@ManyToOne
	@JoinColumn(name = "mediaId", nullable = false)
	private Media media;

	public Listing() {

	}


	public Listing(String condition, Boolean isActive, String description, User user, Game game, Media media) {
		this.condition = condition;
		this.isActive = isActive;
		this.description = description;
		this.user = user;
		this.game = game;
		this.media = media;
	}
	
	@PrePersist
    	protected void onCreate() {
        	createdAt = new Date();
    	}


	public Integer getListingId() {
		return listingId;
	}

	public void setListingId(Integer listingId) {
		this.listingId = listingId;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}


	public Boolean getIsActive() {
		return isActive;
	}

	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public Media getMedia() {
		return media;
	}

	public void setMedia(Media media) {
		this.media = media;
	}

}