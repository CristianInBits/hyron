package dev.cristianinbits.hyron.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // IMPORTANTE: para ngrok usa allowedOriginPatterns (comodines)
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "http://localhost",
                "http://127.0.0.1",
                "http://192.168.*.*:5173", // opcional: acceso por IP en LAN
                "https://*.ngrok-free.dev" // ngrok (plan free)
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
