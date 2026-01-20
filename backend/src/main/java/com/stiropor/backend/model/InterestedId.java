package com.stiropor.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.util.Objects;

@Embeddable
public class InterestedId {
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "genre_id")
    private Integer genreId;

    public InterestedId() {}

    public InterestedId(Integer userId, Integer genreId) {
        this.userId = userId;
        this.genreId = genreId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InterestedId that = (InterestedId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(genreId, that.genreId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, genreId);
    }
}
