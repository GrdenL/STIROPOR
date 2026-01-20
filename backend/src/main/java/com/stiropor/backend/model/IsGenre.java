package com.stiropor.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "is_genre")
public class IsGenre {
    @EmbeddedId
    private InterestedId id;

    @ManyToOne
    @MapsId("gameId")
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne
    @MapsId("genreId")
    @JoinColumn(name = "genre_id")
    private Genre genre;


    public IsGenre() {
    }

    public IsGenre(Game game, Genre genre) {
        this.game = game;
        this.genre = genre;
        this.id = new InterestedId(game.getGameId(), genre.getGenreId());
    }
}
