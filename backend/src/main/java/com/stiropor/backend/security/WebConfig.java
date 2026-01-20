package com.stiropor.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebConfig {
    @Value("${server.frontend}")
    private String frontendUrl;
    @Value("${server.frontend.allowed-origins:}")
    private String allowedOrigins;

    private String[] resolveAllowedOrigins() {
        String raw = allowedOrigins == null || allowedOrigins.isBlank()
                ? frontendUrl
                : allowedOrigins;
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toArray(String[]::new);
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        String[] origins = resolveAllowedOrigins();
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(origins)
                        .allowCredentials(true)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("Set-Cookie");
            }
        };
    }
}
