package com.stiropor.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "is_intrested")
public class Interested {
    @EmbeddedId
    private InterestedId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("genreId")
    @JoinColumn(name = "genre_id")
    private Genre genre;


    public Interested() {
    }

    public Interested(User user, Genre genre) {
        this.user = user;
        this.genre = genre;
        this.id = new InterestedId(user.getUserId(), genre.getGenreId());
    }
}
