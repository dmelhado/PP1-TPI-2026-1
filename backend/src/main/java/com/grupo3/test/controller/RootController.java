package com.grupo3.test.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "app", "LogiTrack API",
                "status", "ok",
                "swagger", "/swagger-ui/index.html",
                "healthHint", "Use /api/ouch or /api/envios"
        );
    }
}
