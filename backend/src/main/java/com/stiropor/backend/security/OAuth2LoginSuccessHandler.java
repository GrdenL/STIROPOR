package com.stiropor.backend.security;

import com.stiropor.backend.model.User;
import com.stiropor.backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import com.stiropor.backend.utils.JwtUtil;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${server.frontend}")
    private String frontendUrl;

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public OAuth2LoginSuccessHandler(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String googleId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email != null) {
            User user = userService.findByEmail(email);

            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setUsername(name != null ? name : "");
                user.setDescription("");
                user.setRole("USER");
                user.setTownId(1);
                user.setGoogleId(googleId);
                user.setLatitude(0.0);
                user.setLongitude(0.0);
                userService.save(user);
            } else if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                userService.save(user);
            }
        }

        String token = jwtUtil.generateToken(email);
        response.sendRedirect(frontendUrl + "?token=" + token);
    }
}
