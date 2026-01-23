package com.stiropor.backend.security;

import com.stiropor.backend.service.UserService;
import com.stiropor.backend.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.JwtException;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil,  UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String jwt = null;
        String email = null;

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ") && authHeader.length() > 7) {
            jwt = authHeader.substring(7);
            email = resolveEmailFromToken(jwt);
        }

        if (email == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    email = resolveEmailFromToken(jwt);
                    if (email != null) {
                        break;
                    }
                }
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            new User(email, "", Collections.emptyList()),
                            null,
                            Collections.emptyList()
                    );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveEmailFromToken(String jwt) {
        String subject = safelyExtractSubject(jwt);
        if (subject == null) {
            return null;
        }

        com.stiropor.backend.model.User user = resolveUserBySubject(subject);
        return user != null ? user.getEmail() : null;
    }

    private String safelyExtractSubject(String jwt) {
        if (jwt == null || jwt.isBlank()) {
            return null;
        }
        try {
            return jwtUtil.extractUsername(jwt);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    private com.stiropor.backend.model.User resolveUserBySubject(String subject) {
        com.stiropor.backend.model.User user = userService.findByEmail(subject);
        if (user != null) {
            return user;
        }

        user = userService.findByEmailIgnoreCase(subject);
        if (user != null) {
            return user;
        }

        user = userService.findByGoogleId(subject);
        if (user != null) {
            return user;
        }

        Integer userId = parseUserId(subject);
        if (userId != null) {
            return userService.findByUserId(userId);
        }

        return null;
    }

    private Integer parseUserId(String subject) {
        try {
            return Integer.valueOf(subject);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
