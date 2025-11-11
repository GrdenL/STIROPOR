package com.stiropor.backend.model;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userid", nullable = false)
    private Integer userId;

    @Column(name = "googleid", unique = true)
    private String googleId;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "description")
    private String description;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    @Column(name = "townid", nullable = false)
    private Integer townId;

    public User() {

    }

    public User(String email, String passwordHash, String username, Double latitude,
                Double longitude) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.username = username;
        this.role = "USER";
        this.description = "";
        this.latitude = latitude;
        this.longitude = longitude;
        this.townId = 1;
    }

    public User(String googleId, String email, String username,
                Double latitude, Double longitude, Integer townId) {
        this.googleId = googleId;
        this.email = email;
        this.username = username;
        this.role = "USER";
        this.description = "";
        this.latitude = latitude;
        this.longitude = longitude;
        this.townId = 1;
    }


    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getTownId() {
        return townId;
    }

    public void setTownId(Integer townId) {
        this.townId = townId;
    }
}
