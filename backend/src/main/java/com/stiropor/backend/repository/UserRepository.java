package com.stiropor.backend.repository;


import com.stiropor.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    User findByUserId(int id);
    User findByEmail(String email);
    User findByEmailIgnoreCase(String email);
    User findByGoogleId(String googleId);
    void deleteByEmail(String email);
}
