package com.stiropor.backend.service;

import com.stiropor.backend.model.Notification;
import com.stiropor.backend.model.User;
import com.stiropor.backend.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    public NotificationService(NotificationRepository notificationRepository, JavaMailSender mailSender) {
        this.notificationRepository = notificationRepository;
        this.mailSender = mailSender;
    }

    public void delete(Notification notification) {
        notificationRepository.delete(notification);
    }
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void sendEmailBetweenUsers(String fromEmail, String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("["+fromEmail+"] "+subject);
        String formattedContent = "Dobili ste novu poruku od: " + fromEmail + "\n" + "-------------------------------------------\n\n" + body;
        message.setText(formattedContent);
        message.setFrom("projekt@gmail.com");
        message.setReplyTo(fromEmail);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            logger.warn("Failed to send notification email from {} to {}", fromEmail, toEmail, e);
        }
    }

    public void createAndSendNotification(User recipient, String senderEmail, String type, Integer payloadId, String subject, String body) {
        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setType(type);
        notification.setPayload(payloadId);
        notification.setIsRead(false);
        notificationRepository.save(notification);

        // 2. Slanje pravog emaila
        sendEmailBetweenUsers(senderEmail, recipient.getEmail(), subject, body);
    }
}
