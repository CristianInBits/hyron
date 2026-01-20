package dev.cristianinbits.hyron.shoe.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import dev.cristianinbits.hyron.shoe.domain.Shoe;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Repositorio de acceso a datos para {@link Shoe}.
 */
public interface ShoeRepository extends JpaRepository<Shoe, Long>, JpaSpecificationExecutor<Shoe> {

    /**
     * Busca una zapatilla por id verificando pertenencia al usuario.
     *
     * @param id id de la zapatilla
     * @param userId id del usuario propietario
     * @return zapatilla si existe y pertenece al usuario
     */
    Optional<Shoe> findByIdAndUser_Id(Long id, Long userId);

    /**
     * Comprueba existencia de una zapatilla por id verificando pertenencia al usuario.
     *
     * @param id id de la zapatilla
     * @param userId id del usuario propietario
     * @return true si existe y pertenece al usuario
     */
    boolean existsByIdAndUser_Id(Long id, Long userId);
}