package com.stiropor.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.util.Objects;

@Embeddable
public class IsGenreId {
    @Column(name = "user_id")
    private Integer gameId;

    @Column(name = "genre_id")
    private Integer genreId;

    public IsGenreId() {}

    public IsGenreId(Integer gameId, Integer genreId) {
        this.gameId = gameId;
        this.genreId = genreId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IsGenreId that = (IsGenreId) o;
        return Objects.equals(gameId, that.gameId) && Objects.equals(genreId, that.genreId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gameId, genreId);
    }


}
