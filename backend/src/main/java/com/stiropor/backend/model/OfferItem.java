package com.stiropor.backend.model;


import jakarta.persistence.*;
import java.io.Serializable; 
import java.util.Objects;      


@Entity
@Table(name = "offerItems")
public class OfferItem {

	@EmbeddedId
	private OfferItemId id;

	@ManyToOne
	@MapsId("offerId")
	@JoinColumn(name = "offerId")
	private Offer offer;
	
	@ManyToOne
	@MapsId("listingId")
	@JoinColumn(name = "listingId")
	private Listing listing;

	@Column(name = "quantity", nullable = false)
	private Integer quantity;

	public OfferItem() {
	}
	
	public OfferItem(Offer offer, Listing listing, Integer quantity) {
		this.offer = offer;
		this.listing = listing;
		this.quantity = quantity;
		this.id = new OfferItemId(offer.getOfferId(), listing.getListingId());
	}

	public OfferItemId getId() {
		return id;
	}
	
	public void setId(OfferItemId id) {
		this.id = id;
	}
	
	public Offer getOffer() {
		return offer;
	}
	
	public void setOffer(Offer offer) {
		this.offer = offer;
	}
	
	public Listing getListing() {
		return listing;
	}
	
	public void setListing(Listing listing) {
		this.listing = listing;
	}
	
	public Integer getQuantity() {
		return quantity;
	}
	
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

}

@Embeddable
class OfferItemId implements Serializable {
	
	@Column(name = "offerId")
	private Integer offerId;
	
	@Column(name = "listingId")
	private Integer listingId;
	
	public OfferItemId() {
	}
	
	public OfferItemId(Integer offerId, Integer listingId) {
		this.offerId = offerId;
		this.listingId = listingId;
	}
	
	// Getters and Setters
	
	public Integer getOfferId() {
		return offerId;
	}
	
	public void setOfferId(Integer offerId) {
		this.offerId = offerId;
	}
	
	public Integer getListingId() {
		return listingId;
	}
	
	public void setListingId(Integer listingId) {
		this.listingId = listingId;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		OfferItemId that = (OfferItemId) o;
		return Objects.equals(offerId, that.offerId) && 
		       Objects.equals(listingId, that.listingId);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(offerId, listingId);
	}
}