package com.stiropor.backend.model;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "trade")
public class Trade {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tradeId", nullable = false)
	private Integer tradeId;

	@Column(name = "agreed_at", nullable = false)
	private Date agreedAt;

	@Column(name = "trade_status", nullable = false)
	private Integer tradeStatus;

	@Column(name = "rating_from_buyer", nullable = false)
	private Integer ratingFromBuyer;

	@Column(name = "rating_from_seller", nullable = false)
	private Integer ratingFromSeller;

	@ManyToOne
	@JoinColumn(name = "offerId", nullable = false)
	private Offer offer;

	public Trade() {
	}

	public Trade(Integer tradeStatus, Integer ratingFromBuyer, Integer ratingFromSeller, Offer offer) {
		this.tradeStatus = tradeStatus;
		this.ratingFromBuyer = ratingFromBuyer;
		this.ratingFromSeller = ratingFromSeller;
		this.offer = offer;
	}

	@PrePersist
	protected void onCreate() {
		agreedAt = new Date();
	}


	public Integer getTradeId() {
		return tradeId;
	}

	public void setTradeId(Integer tradeId) {
		this.tradeId = tradeId;
	}

	public Date getAgreedAt() {
		return agreedAt;
	}

	public void setAgreedAt(Date agreedAt) {
		this.agreedAt = agreedAt;
	}

	public Integer getTradeStatus() {
		return tradeStatus;
	}

	public void setTradeStatus(Integer tradeStatus) {
		this.tradeStatus = tradeStatus;
	}

	public Integer getRatingFromBuyer() {
		return ratingFromBuyer;
	}

	public void setRatingFromBuyer(Integer ratingFromBuyer) {
		this.ratingFromBuyer = ratingFromBuyer;
	}

	public Integer getRatingFromSeller() {
		return ratingFromSeller;
	}

	public void setRatingFromSeller(Integer ratingFromSeller) {
		this.ratingFromSeller = ratingFromSeller;
	}

	public Offer getOffer() {
		return offer;
	}

	public void setOffer(Offer offer) {
		this.offer = offer;
	}
}