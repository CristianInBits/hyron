package dev.cristianinbits.hyron.user.service;

import java.util.List;

import dev.cristianinbits.hyron.user.dto.UserCreateRequest;
import dev.cristianinbits.hyron.user.dto.UserResponse;
import dev.cristianinbits.hyron.user.dto.UserUpdateRequest;

/**
 * Interfaz que define las operaciones de negocio para la gestión de usuarios.
 * 
 * ¿Por qué usar una interfaz?
 * 1. Desacoplamiento: El controller depende de la interfaz, no de la implementación
 * 2. Testabilidad: Facilita crear mocks para pruebas unitarias
 * 3. Flexibilidad: Permite cambiar la implementación sin afectar a los consumidores
 * 4. Documentación: Define el contrato que debe cumplir cualquier implementación
 * 
 * Principio de Inversión de Dependencias (DIP):
 * Las clases de alto nivel (Controller) no dependen de clases de bajo nivel (ServiceImpl),
 * ambas dependen de abstracciones (esta interfaz).
 */
public interface UserService {

    /**
     * Crea un nuevo usuario en el sistema.
     * 
     * Operaciones que realiza:
     * 1. Normaliza el email (minúsculas, sin espacios)
     * 2. Normaliza el nombre (sin espacios al inicio/fin)
     * 3. Verifica que el email no esté en uso
     * 4. Persiste el usuario en la base de datos
     * 5. Retorna los datos del usuario creado
     * 
     * @param request DTO con los datos del nuevo usuario (name, email)
     * @return DTO con los datos del usuario creado, incluyendo id y registeredAt
     * @throws ConflictException si el email ya está en uso por otro usuario
     */
    UserResponse createUser(UserCreateRequest request);

    /**
     * Obtiene un usuario por su identificador único.
     * 
     * @param id Identificador del usuario a buscar
     * @return DTO con los datos del usuario encontrado
     * @throws NotFoundException si no existe un usuario con el ID especificado
     */
    UserResponse getUserById(Long id);

    /**
     * Obtiene todos los usuarios registrados en el sistema.
     * 
     * NOTA: Este método retorna TODOS los usuarios sin paginación.
     * Para aplicaciones con muchos usuarios, se recomienda implementar
     * paginación usando Page<UserResponse> y Pageable.
     * 
     * @return Lista de DTOs con todos los usuarios
     */
    List<UserResponse> getAllUsers();

    /**
     * Actualiza parcialmente los datos de un usuario existente.
     * 
     * Solo se actualizan los campos que no son null en el request.
     * Esto permite actualizaciones parciales (PATCH):
     * - {"name": "Nuevo"} → Solo actualiza el nombre
     * - {"email": "nuevo@mail.com"} → Solo actualiza el email
     * - {"name": "Nuevo", "email": "nuevo@mail.com"} → Actualiza ambos
     * 
     * @param id      Identificador del usuario a actualizar
     * @param request DTO con los campos a actualizar (campos null se ignoran)
     * @return DTO con los datos actualizados del usuario
     * @throws NotFoundException si no existe un usuario con el ID especificado
     * @throws ConflictException si el nuevo email ya está en uso por otro usuario
     */
    UserResponse updateUser(Long id, UserUpdateRequest request);

    /**
     * Elimina un usuario del sistema.
     * 
     * La eliminación es permanente (hard delete).
     * Si se requiere soft delete, se debería agregar un campo "deletedAt"
     * a la entidad y modificar las consultas para excluir usuarios eliminados.
     * 
     * @param id Identificador del usuario a eliminar
     * @throws NotFoundException si no existe un usuario con el ID especificado
     */
    void deleteUser(Long id);
}
