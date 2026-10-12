package com.shopsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * ShopSphere Campus - Main Spring Boot Application Entry Point.
 * 
 * Capstone Project: AU-R24 Full Stack Development Using Java.
 * Demonstrates: Spring Boot 3, Spring Data JPA, Spring Security with JWT,
 * Caffeine Caching, and RESTful API Architecture.
 */
@SpringBootApplication
@EnableCaching
public class ShopSphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopSphereApplication.class, args);
    }
}
