package dev.cristianinbits.hyron.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

/**
 * Spring Security configuration for the application.
 *
 * This configuration defines a permissive security setup intended for
 * development or public API scenarios, where all HTTP requests are allowed
 * without authentication.
 *
 * CSRF protection is explicitly disabled to simplify interaction with the API
 * when using tools such as Postman or when exposing stateless REST endpoints.
 */
@Configuration
public class SecurityConfig {

    /**
     * Configures the security filter chain.
     *
     * All incoming requests are permitted without authentication.
     * CSRF protection is disabled to allow non-browser clients to
     * perform POST, PUT, PATCH and DELETE requests without additional setup.
     *
     * @param http the {@link HttpSecurity} to configure
     * @return the configured {@link SecurityFilterChain}
     * @throws Exception if an error occurs while building the filter chain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}
