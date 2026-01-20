package com.stiropor.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


@Entity
@Table(name = "media")
public class Media {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "mediaId", nullable = false)
	private Integer mediaId;

	@Column(name = "href", nullable = false)
	private String href;

	@ManyToOne
	@JoinColumn(name = "userId", nullable = false)
	@JsonIgnore
	private User user;

	public Media(){

	}


	public Media(String href, User user) {
		this.href = href;
		this.user = user;
	}



	public Integer getMediaId() {
		return mediaId;
	}

	public void setMediaId(Integer mediaId) {
		this.mediaId = mediaId;
	}

	public String getHref() {
		return href;
	}

	public void setHref(String href) {
		this.href = href;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

}
