package com.stiropor.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/signin")
public class SignInConnector {
    @GetMapping("/")
    public String signIn() {return "signIn";}

}
