package com.shopsphere.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3.0 / Swagger UI Configuration for ShopSphere Campus.
 * Configures JWT Bearer authentication scheme for interactive API exploration.
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ShopSphere Campus REST API")
                        .description("AI-Powered E-Commerce Platform for Students (AU-R24 Capstone Project)")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("ShopSphere Campus Team")
                                .email("support@shopsphere.edu"))
                        .license(new License()
                                .name("Educational License - AU CSE")
                                .url("https://www.annauniv.edu/")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
