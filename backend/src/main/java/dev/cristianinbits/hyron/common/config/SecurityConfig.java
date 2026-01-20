package dev.cristianinbits.hyron.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Deshabilitar CSRF (No necesario en APIs REST stateless)
            .csrf(AbstractHttpConfigurer::disable)

            // 2. Gestión de sesión STATELESS (No guardar cookies de sesión en el servidor)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 3. Reglas de autorización
            .authorizeHttpRequests(auth -> auth
                // A. Permitir Swagger y OpenAPI (Documentación pública)
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                
                // B. Permitir endpoints de Login/Registro (si los tienes)
                // .requestMatchers("/api/auth/**").permitAll() 

                // C. Todo lo demás (Zapatillas) requiere autenticación
                .anyRequest().authenticated()
            )
            
            // 4. Mecanismo de autenticación (Aquí suele ir JWT, por ahora Basic Auth o Resource Server)
            .httpBasic(withDefaults()); // Útil para probar rápido con Postman

        return http.build();
    }
}