package com.stiropor.backend.dto;

import java.util.List;

public class CreateOfferRequest {

    private Integer requestedListingId;
    private List<Integer> offeredListingIds;
    private String message;

    public CreateOfferRequest() {}

    public Integer getRequestedListingId() {
        return requestedListingId;
    }

    public void setRequestedListingId(Integer requestedListingId) {
        this.requestedListingId = requestedListingId;
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
}