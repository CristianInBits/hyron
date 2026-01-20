package dev.cristianinbits.hyron.common.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.Objects;

/**
 * Implementación basada en Spring Security (SecurityContext).
 */
@Service
public class SecurityContextCurrentUserService implements CurrentUserService {

    @Override
    public Long requireUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("No autenticado");
        }

        Object principal = auth.getPrincipal();
        if (principal == null) {
            throw new UnauthorizedException("Principal no disponible");
        }

        // 1) Caso típico: principal con getId()
        Long idFromGetter = tryExtractIdViaGetter(principal);
        if (idFromGetter != null) return idFromGetter;

        // 2) JWT: claim userId o sub
        if (principal instanceof Jwt jwt) {
            Object userIdClaim = jwt.getClaims().get("userId");
            if (userIdClaim instanceof Number n) return n.longValue();
            if (userIdClaim instanceof String s && isLong(s)) return Long.parseLong(s);

            String sub = jwt.getSubject();
            if (sub != null && isLong(sub)) return Long.parseLong(sub);
        }

        // 3) String (a veces Spring pone username aquí)
        if (principal instanceof String s && isLong(s)) {
            return Long.parseLong(s);
        }

        throw new UnauthorizedException("No se pudo resolver el userId del principal: " + principal.getClass().getName());
    }

    private static Long tryExtractIdViaGetter(Object principal) {
        try {
            Method m = principal.getClass().getMethod("getId");
            Object value = m.invoke(principal);
            if (value instanceof Number n) return n.longValue();
            if (value instanceof String s && isLong(s)) return Long.parseLong(s);
            return null;
        } catch (Exception ignored) {
            return null;
        }
    }

    private static boolean isLong(String s) {
        try {
            Long.parseLong(s);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
