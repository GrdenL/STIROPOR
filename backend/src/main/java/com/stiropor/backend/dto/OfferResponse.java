package com.stiropor.backend.dto;

import java.util.Date;
import java.util.List;

public class OfferResponse {
    private Integer offerId;
    private Integer fromUserId;
    private String fromUsername;
    private Integer toUserId;
    private String toUsername;
    private Integer targetListingId;
    private List<Integer> offeredListingIds;
    private String message;
    private Integer offerStatus; // 0=PENDING, 1=ACCEPTED, 2=REJECTED, 3=CANCELLED
    private Date createdAt;

    public Integer getOfferId() {
        return offerId;
    }

    public void setOfferId(Integer offerId) {
        this.offerId = offerId;
    }

    public Integer getFromUserId() {
        return fromUserId;
    }

    public void setFromUserId(Integer fromUserId) {
        this.fromUserId = fromUserId;
    }

    public String getFromUsername() {
        return fromUsername;
    }

    public void setFromUsername(String fromUsername) {
        this.fromUsername = fromUsername;
    }

    public Integer getToUserId() {
        return toUserId;
    }

    public void setToUserId(Integer toUserId) {
        this.toUserId = toUserId;
    }

    public String getToUsername() {
        return toUsername;
    }

    public void setToUsername(String toUsername) {
        this.toUsername = toUsername;
    }

    public Integer getTargetListingId() {
        return targetListingId;
    }

    public void setTargetListingId(Integer targetListingId) {
        this.targetListingId = targetListingId;
    }

    public List<Integer> getOfferedListingIds() {
        return offeredListingIds;
    }

    public void setOfferedListingIds(List<Integer> offeredListingIds) {
        this.offeredListingIds = offeredListingIds;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getOfferStatus() {
        return offerStatus;
    }

    public void setOfferStatus(Integer offerStatus) {
        this.offerStatus = offerStatus;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
