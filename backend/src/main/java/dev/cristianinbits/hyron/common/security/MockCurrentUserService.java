package dev.cristianinbits.hyron.common.security;

import dev.cristianinbits.hyron.common.interfaces.CurrentUserService;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class MockCurrentUserService implements CurrentUserService {

    /**
     * MOCK TEMPORAL:
     * Devuelve siempre el ID 1.
     * Esto engaña a ShoeService haciéndole creer que el usuario 1 está logueado.
     */
    @Override
    public Long requireUserId() {
        // En el futuro, aquí leeremos el SecurityContextHolder de Spring Security
        return 1L; 
    }
}