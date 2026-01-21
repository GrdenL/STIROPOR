package com.stiropor.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "whishes_for")
public class WishList {
    @EmbeddedId
    private WishListId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("gameId")
    @JoinColumn(name = "game_id")
    private Game game;


    public WishList() {
    }

    public WishList(User user, Game game) {
        this.user = user;
        this.game = game;
        this.id = new WishListId(user.getUserId(), game.getId());
    }

    public WishListId getId() {
        return id;
    }

    public void setId(WishListId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }




}

