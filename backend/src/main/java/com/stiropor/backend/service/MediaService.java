package com.stiropor.backend.service;

import com.stiropor.backend.model.Media;
import com.stiropor.backend.model.User;
import com.stiropor.backend.repository.MediaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MediaService {
    private final MediaRepository mediaRepository;
    public MediaService(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public Media save(Media media) {
        return mediaRepository.save(media);
    }
    public void delete(Media media) {
        mediaRepository.delete(media);
    }
    public List<Media> findByUser(User user) {
        return mediaRepository.findByUser(user);
    }
}
