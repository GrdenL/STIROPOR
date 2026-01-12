package com.stiropor.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "offerItems")
public class OfferItem {

    @EmbeddedId
    private OfferItemID id;

    @ManyToOne(optional = false)
    @MapsId("offerId")
    @JoinColumn(name = "offer_id", nullable = false)
    private Offer offer;

    @ManyToOne(optional = false)
    @MapsId("listingId")
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @Column(nullable = false)
    private Integer quantity;

    protected OfferItem() {
    }

    public OfferItem(Offer offer, Listing listing, Integer quantity) {
        this.offer = offer;
        this.listing = listing;
        this.quantity = quantity;

        this.id = new OfferItemID(
                offer.getOfferId(),
                listing.getListingId()
        );
    }
    public OfferItemID getId() {
        return id;
    }

    public void setId(OfferItemID id) {
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
