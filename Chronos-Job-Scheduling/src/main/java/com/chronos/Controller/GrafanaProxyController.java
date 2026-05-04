package com.chronos.Controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/grafana")
public class GrafanaProxyController {

    @GetMapping("/dashboard")
    public ResponseEntity<byte[]> proxyDashboard() {
        String grafanaUrl = "http://grafana:3000/d/abcd1234";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("user", "password");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<byte[]> response = restTemplate.exchange(
                grafanaUrl,
                HttpMethod.GET,
                entity,
                byte[].class
        );

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(response.getBody());
    }
}
