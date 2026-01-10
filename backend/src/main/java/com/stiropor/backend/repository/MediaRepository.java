package com.stiropor.backend.repository;

import com.stiropor.backend.model.Media;
import com.stiropor.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaRepository extends JpaRepository<Media,Integer> {
    Media getByUser(User user);
}
