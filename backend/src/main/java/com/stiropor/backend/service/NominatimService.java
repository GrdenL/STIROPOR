package com.stiropor.backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NominatimService {
    NominatimService nominatimService;
    private static final String NOMINATIM_URL = "";

    public static String geocode(String address) {
        RestTemplate restTemplate = new RestTemplate();
        String url = NOMINATIM_URL + "?address=" + address + "&format=json";
        return restTemplate.getForObject(url, String.class);
    }
}
