package com.stiropor.backend.security;

import com.stiropor.backend.model.Country;
import com.stiropor.backend.model.Town;
import com.stiropor.backend.model.User;
import com.stiropor.backend.service.CountryService;
import com.stiropor.backend.service.TownService;
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
import com.stiropor.backend.utils.JwtUtil;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${server.frontend}")
    private String frontendUrl;

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final TownService townService;
    private final CountryService countryService;

    public OAuth2LoginSuccessHandler(UserService userService,
                                     JwtUtil jwtUtil,
                                     TownService townService,
                                     CountryService countryService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.townService = townService;
        this.countryService = countryService;
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

        if (email == null) {
            response.sendRedirect(frontendUrl + "/login?oauthError=missing_email");
            return;
        }

        User user = userService.findByEmail(email);
        Town town = getOrCreateUnknownTown();

        if (user == null) {
            user = new User(googleId, email, name != null ? name : "", 0.0, 0.0);
            user.setTown(town);
            userService.save(user);
        } else {
            boolean updated = false;
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                updated = true;
            }
            if (user.getTown() == null) {
                user.setTown(town);
                updated = true;
            }
            if (updated) {
                userService.save(user);
            }
        }

        String token = jwtUtil.generateToken(email);
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 10);
        cookie.setAttribute("SameSite", "None");
        response.addCookie(cookie);
        response.sendRedirect(frontendUrl + "?token=" + token);
    }

    private Town getOrCreateUnknownTown() {
        Town town = townService.findByName("Unknown");
        if (town != null) {
            return town;
        }

        Country country = countryService.findById("Unknown");
        if (country == null) {
            country = new Country("Unknown");
            countryService.save(country);
        }

        return townService.save(new Town("Unknown", country));
    }
}
