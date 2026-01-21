package dev.cristianinbits.hyron.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Deshabilitar CSRF (igual que antes)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Sesión Stateless (igual que antes)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. AUTORIZACIÓN: AQUÍ ESTÁ EL CAMBIO
                .authorizeHttpRequests(auth -> auth
                        // ⚠️ TEMPORAL: Permitimos acceso a todo sin login
                        .anyRequest().permitAll());

        return http.build();
    }
}