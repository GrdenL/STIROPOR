package com.stiropor.backend.repository;

import com.stiropor.backend.model.Notification;
import com.stiropor.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Integer> {
    List<Notification> getByUser(User user);
}
