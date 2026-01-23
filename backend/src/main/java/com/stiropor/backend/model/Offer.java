package com.stiropor.backend.model;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "offers")
public class Offer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "offer_id", nullable = false)
	private Integer offerId;

	@Column(name = "offer_status", nullable = false)
	private Integer offer_status;

	@Column(name = "message")
	private String message;

	@Column(name = "created_at", nullable = false)
    	private Date createdAt;

	@ManyToOne
	@JoinColumn(name = "from_user_id", nullable = false)
	private User from_user;

	@ManyToOne
	@JoinColumn(name = "to_user_id", nullable = false)
	private User to_user;

	@ManyToOne
	@JoinColumn(name = "target_listing_id", nullable = false)
	private Listing listing;

	public Offer(){

	}


	public Offer(Integer offer_status, String message, User from_user, User to_user, Listing listing) {
		this.offer_status = offer_status;
		this.message = message;
		this.from_user = from_user;
		this.to_user = to_user;
		this.listing = listing;
	}

	@PrePersist
    	protected void onCreate() {
        	createdAt = new Date();
    	}



	public Integer getOfferId() {
		return offerId;
	}

	public void setOfferId(Integer offerId) {
		this.offerId = offerId;
	}

	public Integer getOffer_status() {
		return offer_status;
	}

	public void setOffer_status(Integer offer_status) {
		this.offer_status = offer_status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public User getFrom_user() {
		return from_user;
	}

	public void setFrom_user(User from_user) {
		this.from_user = from_user;
	}

	public User getTo_user() {
		return to_user;
	}

	public void setTo_user(User to_user) {
		this.to_user = to_user;
	}

	public Listing getListing() {
		return listing;
	}

	public void setListing(Listing listing) {
		this.listing = listing;
	}

}