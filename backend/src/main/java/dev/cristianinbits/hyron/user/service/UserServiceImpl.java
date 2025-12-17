package dev.cristianinbits.hyron.user.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.cristianinbits.hyron.exception.ConflictException;
import dev.cristianinbits.hyron.exception.NotFoundException;

import dev.cristianinbits.hyron.user.domain.User;
import dev.cristianinbits.hyron.user.dto.UserCreateRequest;
import dev.cristianinbits.hyron.user.dto.UserResponse;
import dev.cristianinbits.hyron.user.dto.UserUpdateRequest;
import dev.cristianinbits.hyron.user.repo.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Implementación de las operaciones de negocio para la gestión de usuarios.
 * 
 * Anotaciones de clase:
 * - @Service: Marca esta clase como un componente de servicio de Spring.
 *   Spring la detecta automáticamente y crea una instancia (bean) al iniciar.
 * 
 * - @RequiredArgsConstructor: Lombok genera un constructor con todos los campos final.
 *   Esto permite la inyección de dependencias por constructor (la forma recomendada).
 * 
 * - @Transactional: Todos los métodos públicos se ejecutan dentro de una transacción.
 *   Si algo falla, se hace rollback automático de todos los cambios.
 */
@Service
@RequiredArgsConstructor
@Transactional  // Por defecto: readOnly = false, propagation = REQUIRED
public class UserServiceImpl implements UserService {

    /**
     * Repositorio para operaciones de persistencia.
     * 
     * Spring inyecta automáticamente la implementación gracias a:
     * 1. @RequiredArgsConstructor genera el constructor
     * 2. El campo es final, así que es obligatorio en el constructor
     * 3. Spring busca un bean que implemente UserRepository y lo inyecta
     */
    private final UserRepository userRepository;

    /**
     * {@inheritDoc}
     * 
     * Flujo de ejecución:
     * 1. Normaliza email y nombre para consistencia
     * 2. Verifica unicidad del email
     * 3. Crea la entidad User
     * 4. Persiste en BD (el @PrePersist asigna registeredAt)
     * 5. Convierte a DTO y retorna
     */
    @Override
    public UserResponse createUser(UserCreateRequest request) {
        // Normalización: garantiza consistencia en los datos
        String normalizedEmail = normalizeEmail(request.email());
        String normalizedName = normalizeName(request.name());

        // Validación de negocio: email único
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ConflictException("Email already in use: " + normalizedEmail);
        }

        // Creación de la entidad
        User user = new User();
        user.setName(normalizedName);
        user.setEmail(normalizedEmail);
        // registeredAt se asigna automáticamente en @PrePersist

        // Persistencia: save() hace INSERT porque el id es null
        User saved = userRepository.save(user);

        // Conversión a DTO para la respuesta
        return toResponse(saved);
    }

    /**
     * {@inheritDoc}
     * 
     * @Transactional(readOnly = true):
     * - Optimiza el rendimiento para operaciones de solo lectura
     * - Hibernate no hace "dirty checking" (no busca cambios para guardar)
     * - Puede usar réplicas de lectura en bases de datos distribuidas
     */
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id " + id));
        return toResponse(user);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)  // Referencia a método: equivale a u -> toResponse(u)
                .toList();
    }

    /**
     * {@inheritDoc}
     * 
     * Implementa actualización parcial (PATCH semantics):
     * - Solo actualiza campos que no son null en el request
     * - Campos null en el request = "no modificar"
     */
    @Override
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        // Primero verificamos que el usuario existe
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id " + id));

        // Actualización condicional del email
        if (request.email() != null) {
            String normalizedEmail = normalizeEmail(request.email());

            // Verifica que el email no esté en uso por OTRO usuario
            // existsByEmailAndIdNot excluye al usuario actual de la búsqueda
            if (userRepository.existsByEmailAndIdNot(normalizedEmail, id)) {
                throw new ConflictException("Email already in use: " + normalizedEmail);
            }
            user.setEmail(normalizedEmail);
        }

        // Actualización condicional del nombre
        if (request.name() != null) {
            user.setName(normalizeName(request.name()));
        }

        // save() hace UPDATE porque el id ya existe
        // Hibernate detecta que la entidad está "managed" y tiene un id
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    /**
     * {@inheritDoc}
     * 
     * Primero busca el usuario para:
     * 1. Verificar que existe (lanzar NotFoundException si no)
     * 2. Tener la entidad para pasarla a delete()
     * 
     * Alternativa: deleteById(id) pero no lanza excepción si no existe.
     */
    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id " + id));
        userRepository.delete(user);
    }

    // ==========================================================================
    // Métodos privados de normalización
    // ==========================================================================

    /**
     * Normaliza una dirección de email.
     * 
     * Operaciones:
     * 1. trim(): Elimina espacios al inicio y final
     * 2. toLowerCase(Locale.ROOT): Convierte a minúsculas de forma consistente
     * 
     * Locale.ROOT garantiza comportamiento consistente independiente del idioma
     * del sistema (evita problemas con caracteres como la "I" turca).
     * 
     * @param email Email a normalizar
     * @return Email normalizado (minúsculas, sin espacios extremos)
     */
    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    /**
     * Normaliza un nombre de usuario.
     * 
     * Solo elimina espacios al inicio y final.
     * No convierte a minúsculas porque los nombres propios
     * suelen tener mayúsculas significativas.
     * 
     * @param name Nombre a normalizar
     * @return Nombre sin espacios extremos
     */
    private String normalizeName(String name) {
        return name.trim();
    }

    // ==========================================================================
    // Métodos privados de mapeo (Entity <-> DTO)
    // ==========================================================================

    /**
     * Convierte una entidad User a un DTO UserResponse.
     * 
     * Este método centraliza la conversión para:
     * 1. Evitar duplicación de código
     * 2. Garantizar consistencia en las respuestas
     * 3. Facilitar cambios futuros (solo modificar aquí)
     * 
     * En proyectos más grandes, se suele usar MapStruct para esto.
     * 
     * @param user Entidad a convertir
     * @return DTO con los datos del usuario
     */
    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRegisteredAt()
        );
    }
}