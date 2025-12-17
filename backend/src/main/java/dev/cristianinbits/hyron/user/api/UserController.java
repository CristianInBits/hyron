package dev.cristianinbits.hyron.user.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import dev.cristianinbits.hyron.user.dto.UserCreateRequest;
import dev.cristianinbits.hyron.user.dto.UserResponse;
import dev.cristianinbits.hyron.user.dto.UserUpdateRequest;
import dev.cristianinbits.hyron.user.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para la gestión de usuarios.
 * 
 * Este controlador expone los endpoints de la API para operaciones CRUD
 * sobre usuarios. Sigue los principios REST:
 * - Recursos identificados por URLs (/api/users, /api/users/{id})
 * - Operaciones definidas por verbos HTTP (GET, POST, PATCH, DELETE)
 * - Respuestas con códigos de estado apropiados
 * 
 * Anotaciones de clase:
 * - @RestController: Combina @Controller + @ResponseBody.
 *   Todos los métodos retornan datos (JSON) en lugar de vistas.
 * 
 * - @RequestMapping("/api/users"): Prefijo común para todos los endpoints.
 *   Todos los métodos heredan esta ruta base.
 * 
 * - @RequiredArgsConstructor: Inyección de dependencias por constructor.
 * 
 * - @Validated: Habilita la validación de parámetros a nivel de clase.
 *   Necesario para que @Positive funcione en @PathVariable.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated  // Activa validación de @Positive en path variables
public class UserController {

    /**
     * Servicio de negocio inyectado automáticamente.
     * El controller delega toda la lógica al service.
     */
    private final UserService userService;

    /**
     * Crea un nuevo usuario.
     * 
     * Endpoint: POST /api/users
     * 
     * @param request Body JSON con los datos del usuario:
     *                {
     *                  "name": "Juan Pérez",
     *                  "email": "juan@email.com"
     *                }
     * @return Datos del usuario creado con código 201 Created
     * 
     * Anotaciones:
     * - @PostMapping: Mapea peticiones POST a este método
     * - @ResponseStatus(CREATED): Retorna 201 en lugar del 200 por defecto
     * - @Valid: Activa la validación del DTO (ejecuta @NotBlank, @Email, etc.)
     * - @RequestBody: Indica que el parámetro viene del body de la petición
     * 
     * Posibles respuestas:
     * - 201 Created: Usuario creado exitosamente
     * - 400 Bad Request: Datos inválidos (validación fallida)
     * - 409 Conflict: Email ya está en uso
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody UserCreateRequest request) {
        return userService.createUser(request);
    }

    /**
     * Obtiene todos los usuarios.
     * 
     * Endpoint: GET /api/users
     * 
     * @return Lista de todos los usuarios con código 200 OK
     * 
     * TODO: Implementar paginación cuando el número de usuarios crezca.
     * Cambiar a:
     *   Page<UserResponse> getAllUsers(Pageable pageable)
     * 
     * Ejemplo de petición paginada:
     *   GET /api/users?page=0&size=20&sort=name,asc
     */
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * Obtiene un usuario por su ID.
     * 
     * Endpoint: GET /api/users/{id}
     * 
     * @param id Identificador del usuario (debe ser positivo)
     * @return Datos del usuario con código 200 OK
     * 
     * Anotaciones:
     * - @GetMapping("/{id}"): Mapea GET con un segmento variable en la URL
     * - @PathVariable: Extrae el valor de {id} de la URL
     * - @Positive: Valida que el ID sea > 0 (requiere @Validated en la clase)
     * 
     * Posibles respuestas:
     * - 200 OK: Usuario encontrado
     * - 400 Bad Request: ID no es un número positivo
     * - 404 Not Found: No existe usuario con ese ID
     */
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable @Positive Long id) {
        return userService.getUserById(id);
    }

    /**
     * Actualiza parcialmente un usuario.
     * 
     * Endpoint: PATCH /api/users/{id}
     * 
     * @param id      Identificador del usuario a actualizar
     * @param request Body JSON con los campos a actualizar (opcionales):
     *                {
     *                  "name": "Nuevo Nombre",  // opcional
     *                  "email": "nuevo@email.com"  // opcional
     *                }
     * @return Datos actualizados del usuario con código 200 OK
     * 
     * ¿Por qué PATCH y no PUT?
     * - PUT: Reemplaza TODO el recurso. Todos los campos son obligatorios.
     * - PATCH: Actualiza SOLO los campos enviados. Campos ausentes no cambian.
     * 
     * PATCH es más flexible para actualizaciones parciales.
     * Ejemplo: Cambiar solo el nombre sin conocer el email actual.
     * 
     * Posibles respuestas:
     * - 200 OK: Usuario actualizado exitosamente
     * - 400 Bad Request: Datos inválidos
     * - 404 Not Found: No existe usuario con ese ID
     * - 409 Conflict: Nuevo email ya está en uso por otro usuario
     */
    @PatchMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        return userService.updateUser(id, request);
    }

    /**
     * Elimina un usuario.
     * 
     * Endpoint: DELETE /api/users/{id}
     * 
     * @param id Identificador del usuario a eliminar
     * 
     * Anotaciones:
     * - @DeleteMapping("/{id}"): Mapea peticiones DELETE
     * - @ResponseStatus(NO_CONTENT): Retorna 204 sin body
     * 
     * ¿Por qué 204 No Content?
     * - El recurso fue eliminado exitosamente
     * - No hay nada que retornar (el recurso ya no existe)
     * - Es el código estándar para DELETE exitoso
     * 
     * Posibles respuestas:
     * - 204 No Content: Usuario eliminado exitosamente
     * - 400 Bad Request: ID no es un número positivo
     * - 404 Not Found: No existe usuario con ese ID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable @Positive Long id) {
        userService.deleteUser(id);
    }
}