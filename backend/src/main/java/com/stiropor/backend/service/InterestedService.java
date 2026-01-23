package com.stiropor.backend.service;

import com.stiropor.backend.model.Game;
import com.stiropor.backend.model.Genre;
import com.stiropor.backend.model.Interested;
import com.stiropor.backend.model.User;
import com.stiropor.backend.repository.InterestedRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterestedService {
    private final InterestedRepository interestedRepository;

    public InterestedService(InterestedRepository interestedRepository) {
        this.interestedRepository = interestedRepository;
    }

    public Interested save(Interested s) {
        return interestedRepository.save(s);
    }
    public void delete(Interested s) {
        interestedRepository.delete(s);
    }
    public List<Genre> findByUser(User user) {
        return interestedRepository.findGenresByUser(user);
    }
    public List<Genre> findByUserId(Integer userId) {
        return interestedRepository.findGenresByUserId(userId);
    }
}
