package com.stiropor.backend.controller;

import com.stiropor.backend.model.User;
import com.stiropor.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/getAllUsers")
    public List<User> findAll() {
        return userService.findAll();
    }

    @PostMapping("/login")
    public User getByEmailAndPassword(@RequestParam String email, @RequestParam String password_hash) {
        User user = userService.findByEmail(email);
        if (user != null) {
            if (password_hash.equals(user.getPasswordHash())){
                return user;
            }
            return null;
        }
        return null;
    }

    @GetMapping("/getUser")
    public User getByEmail(@RequestParam String email) {
        return userService.findByEmail(email);
    }

    @PutMapping("/updateUser")
    public void update(@RequestBody User user) {
        userService.save(user);
    }

    @DeleteMapping("/deleteUser")
    public void deleteByEmail(@RequestParam String email) {
        userService.deleteByEmail(email);
    }

    @PostMapping("/register")
    public User insert(@RequestBody User user) {
        if(userService.findByEmail(user.getEmail())!=null){
            return null;
        }

        return userService.save(user);
    }
}

