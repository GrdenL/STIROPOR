package com.stiropor.backend.service;

import com.stiropor.backend.model.Notification;
import com.stiropor.backend.model.User;
import com.stiropor.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getByUser(User user) {
        return  notificationRepository.getByUser(user);
    }
    public void delete(Notification notification) {
        notificationRepository.delete(notification);
    }
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }
}
