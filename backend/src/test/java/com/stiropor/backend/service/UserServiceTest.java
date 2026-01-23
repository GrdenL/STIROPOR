package com.stiropor.backend.service;

import com.stiropor.backend.model.User;
import com.stiropor.backend.model.Town;
import com.stiropor.backend.model.Country;
import com.stiropor.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("test@example.com", "hashedPassword", "testUser",
                0.0, 0.0, new Town("Unknown", new Country("Unknown")));
    }

    @Test
    void testFindByUserId() {
        when(userRepository.findByUserId(1)).thenReturn(testUser);

        User result = userService.findByUserId(1);

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(userRepository, times(1)).findByUserId(1);
    }

    @Test
    void testFindByEmail() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(testUser);

        User result = userService.findByEmail("test@example.com");

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testDeleteByEmail() {
        doNothing().when(userRepository).deleteByEmail("test@example.com");

        userService.deleteByEmail("test@example.com");

        verify(userRepository, times(1)).deleteByEmail("test@example.com");
    }

    @Test
    void testSave() {
        when(userRepository.save(testUser)).thenReturn(testUser);

        User result = userService.save(testUser);

        assertNotNull(result);
        assertEquals(testUser, result);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testFindAll() {
        when(userRepository.findAll()).thenReturn(List.of(testUser));

        List<User> result = userService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUser, result.get(0));
        verify(userRepository, times(1)).findAll();
    }
}
