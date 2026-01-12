package com.stiropor.backend.repository;

import com.stiropor.backend.model.Country;
import com.stiropor.backend.model.Town;
import com.stiropor.backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {
    private UserRepository userRepository;

    private User testUser;

    UserRepositoryTest(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @BeforeEach
    void setUp() {
        Town town = new Town("TestTown", new Country("TestCountry"));
        testUser = new User("test@example.com", "hashedPassword", "testUser", 0.0, 0.0, town);
        userRepository.save(testUser);
    }

    @Test
    void testFindByEmail() {
        User user = userRepository.findByEmail("test@example.com");
        assertNotNull(user);
        assertEquals("testUser", user.getUsername());
    }

    @Test
    void testFindByUserId() {
        User user = userRepository.findByUserId(testUser.getUserId());
        assertNotNull(user);
        assertEquals("test@example.com", user.getEmail());
    }

    @Test
    void testDeleteByEmail() {
        userRepository.deleteByEmail("test@example.com");
        User user = userRepository.findByEmail("test@example.com");
        assertNull(user);
    }

    @Test
    void testFindAll() {
        List<User> users = userRepository.findAll();
        assertFalse(users.isEmpty());
        assertEquals(1, users.size());
        assertEquals(testUser.getEmail(), users.get(0).getEmail());
    }
}
