package com.stiropor.backend.model;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "notifications")
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "notification_id", nullable = false)
	private Integer notificationId;

	@Column(name = "type", nullable = false)
	private String type;

	@Column(name = "payload", nullable = false)
	private Integer payload;

	@Column(name = "is_read", nullable = false)
	private Boolean isRead;

	@Column(name = "created_at", nullable = false)
	private Date createdAt;

	@ManyToOne
	@JoinColumn(name = "userId", nullable = false)
	private User user;

	public Notification() {
	}

	public Notification(String type, Integer payload, Boolean isRead, User user) {
		this.type = type;
		this.payload = payload;
		this.isRead = isRead;
		this.user = user;
	}

	@PrePersist
	protected void onCreate() {
		createdAt = new Date();
		if (isRead == null) {
			isRead = false;
		}
	}


	public Integer getNotificationId() {
		return notificationId;
	}

	public void setNotificationId(Integer notificationId) {
		this.notificationId = notificationId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getPayload() {
		return payload;
	}

	public void setPayload(Integer payload) {
		this.payload = payload;
	}

	public Boolean getIsRead() {
		return isRead;
	}

	public void setIsRead(Boolean isRead) {
		this.isRead = isRead;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
}