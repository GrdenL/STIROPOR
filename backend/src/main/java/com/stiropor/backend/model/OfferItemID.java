package com.stiropor.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OfferItemID implements Serializable {

    @Column(name = "offer_id")
    private Integer offerId;

    @Column(name = "listing_id")
    private Integer listingId;

    protected OfferItemID() {
    }

    public OfferItemID(Integer offerId, Integer listingId) {
        this.offerId = offerId;
        this.listingId = listingId;
    }

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
        OfferItemID that = (OfferItemID) o;
        return Objects.equals(offerId, that.offerId) &&
                Objects.equals(listingId, that.listingId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(offerId, listingId);
    }
}
