package dev.cristianinbits.hyron.user.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import dev.cristianinbits.hyron.user.domain.User;

/**
 * Repositorio para operaciones de persistencia de usuarios.
 * 
 * Esta interfaz extiende JpaRepository, lo que proporciona automáticamente
 * métodos CRUD básicos sin necesidad de implementación:
 * - save(entity): Guarda o actualiza una entidad
 * - findById(id): Busca por ID
 * - findAll(): Obtiene todas las entidades
 * - delete(entity): Elimina una entidad
 * - count(): Cuenta el total de registros
 * - existsById(id): Verifica si existe un ID
 * 
 * Spring Data JPA genera la implementación en tiempo de ejecución
 * basándose en el nombre de los métodos (Query Methods).
 * 
 * @see JpaRepository
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Busca un usuario por su dirección de email.
     * 
     * Spring Data JPA traduce este método a:
     * SELECT * FROM users WHERE email = ?
     * 
     * @param email Dirección de email a buscar (debe estar normalizado)
     * @return Optional conteniendo el usuario si existe, vacío si no
     * 
     * Ejemplo de uso:
     * 
     * Optional<User> user = userRepository.findByEmail("juan@mail.com");
     * user.ifPresent(u -> System.out.println(u.getName()));
     * 
     */
    Optional<User> findByEmail(String email);

    /**
     * Verifica si existe un usuario con el email especificado.
     * 
     * Spring Data JPA traduce este método a:
     * SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)
     * 
     * Más eficiente que findByEmail() cuando solo necesitas
     * saber si existe, sin recuperar los datos completos.
     * 
     * @param email Dirección de email a verificar
     * @return true si existe un usuario con ese email, false en caso contrario
     * 
     * Caso de uso típico: Validar que un email no esté en uso antes de crear un usuario.
     */
    boolean existsByEmail(String email);

    /**
     * Verifica si existe un usuario con el email especificado,
     * excluyendo un usuario específico por su ID.
     * 
     * Spring Data JPA traduce este método a:
     * SELECT EXISTS(SELECT 1 FROM users WHERE email = ? AND id != ?)
     * 
     * @param email Dirección de email a verificar
     * @param id    ID del usuario a excluir de la búsqueda
     * @return true si existe otro usuario con ese email, false en caso contrario
     * 
     * Caso de uso típico: Validar que un email no esté en uso por OTRO usuario
     * durante una actualización. Permite que el usuario mantenga su propio email.
     * 
     * Ejemplo:
     * - Usuario con id=1 tiene email "juan@mail.com"
     * - Quiere cambiar su email a "pedro@mail.com"
     * - existsByEmailAndIdNot("pedro@mail.com", 1) verifica si otro usuario lo tiene
     * - Si el usuario 1 mantiene su email: existsByEmailAndIdNot("juan@mail.com", 1) = false
     */
    boolean existsByEmailAndIdNot(String email, Long id);
}