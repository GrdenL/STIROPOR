package com.stiropor.backend.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NominatimService {

    private static final String NOMINATIM_URL =
            "https://nominatim.openstreetmap.org/search";

    public LocationResponse geocode(String query) {

        String url = NOMINATIM_URL +
                "?q=" + query +
                "&format=json" +
                "&limit=1";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "stiropor-app/1.0 (email@example.com)"); //TREBA POSTAVITI

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<LocationResponse[]> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, LocationResponse[].class);

        if (response.getBody() != null && response.getBody().length > 0) {
            return response.getBody()[0];
        }

        return null;
    }

    public static class LocationResponse {
        public String lat;
        public String lon;
    }
}
