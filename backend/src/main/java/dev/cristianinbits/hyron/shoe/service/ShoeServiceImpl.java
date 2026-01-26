package dev.cristianinbits.hyron.shoe.service;

import dev.cristianinbits.hyron.common.exception.ShoeNotFoundException;
import dev.cristianinbits.hyron.common.interfaces.CurrentUserService;
import dev.cristianinbits.hyron.common.web.PageQuery;
import dev.cristianinbits.hyron.common.web.PageQueryMapper;
import dev.cristianinbits.hyron.common.web.PageResult;
import dev.cristianinbits.hyron.shoe.domain.Shoe;
import dev.cristianinbits.hyron.shoe.domain.ShoeType;
import dev.cristianinbits.hyron.shoe.dto.ShoeCreateRequest;
import dev.cristianinbits.hyron.shoe.dto.ShoeResponse;
import dev.cristianinbits.hyron.shoe.dto.ShoeUpdateRequest;
import dev.cristianinbits.hyron.shoe.repo.ShoeRepository;
import dev.cristianinbits.hyron.user.repo.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.springframework.data.jpa.domain.Specification.where;
import static java.util.Map.entry;

/**
 * Implementación del dominio Shoes.
 *
 * <p>
 * Notas:
 * <ul>
 * <li>Seguridad: siempre se filtra por userId para evitar acceso a recursos
 * ajenos.</li>
 * <li>Delete: soft delete poniendo active=false.</li>
 * <li>Update (PUT): reemplaza campos configurables, pero NO toca
 * accumulatedDistanceMeters.</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ShoeServiceImpl implements ShoeService {

    private static final Map<String, String> ALLOWED_SORTS = Map.ofEntries(
            entry("id", "id"),
            entry("brand", "brand"),
            entry("model", "model"),
            entry("purchaseDate", "purchaseDate"),
            entry("active", "active"),
            entry("favorite", "favorite"),
            entry("type", "type"));

    // Desempate por ID (lo más nuevo creado)
    private static final Sort DEFAULT_SORT = Sort.by("purchaseDate").descending()
            .and(Sort.by("id").descending());

    private final ShoeRepository shoeRepository;
    private final UserRepository userRepository;
    private final ShoeMapper shoeMapper;
    private final CurrentUserService currentUserService;

    @Override
    public ShoeResponse create(ShoeCreateRequest request) {
        Long userId = currentUserService.requireUserId();

        Shoe shoe = shoeMapper.toEntity(request);
        shoe.setUser(userRepository.getReferenceById(userId));

        Shoe saved = shoeRepository.save(shoe);
        return shoeMapper.toResponse(saved);
    }

    @Override
    public ShoeResponse update(Long id, ShoeUpdateRequest request) {
        Long userId = currentUserService.requireUserId();

        Shoe shoe = shoeRepository.findByIdAndUser_Id(id, userId)
                .orElseThrow(() -> new ShoeNotFoundException(id));

        // PUT: reemplaza campos configurables; NO tocar accumulatedDistanceMeters
        shoeMapper.applyPut(request, shoe);

        Shoe saved = shoeRepository.save(shoe);
        return shoeMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ShoeResponse getById(Long id) {
        Long userId = currentUserService.requireUserId();

        Shoe shoe = shoeRepository.findByIdAndUser_Id(id, userId)
                .orElseThrow(() -> new ShoeNotFoundException(id));

        return shoeMapper.toResponse(shoe);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<ShoeResponse> getMyShoes(ShoeType type, Boolean active, PageQuery pageQuery) {
        Long userId = currentUserService.requireUserId();

        Pageable pageable = PageQueryMapper.toPageable(pageQuery, DEFAULT_SORT, ALLOWED_SORTS);

        // 1. Especificación base: Pertenencia al usuario
        Specification<Shoe> spec = where((root, query, cb) -> cb.equal(root.get("user").get("id"), userId));

        // 2. Filtros dinámicos
        if (type != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("type"), type));
        }
        if (active != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("active"), active));
        }

        Page<Shoe> page = shoeRepository.findAll(spec, pageable);
        return PageQueryMapper.toPageResult(page, shoeMapper::toResponse);
    }

    @Override
    public void delete(Long id) {
        Long userId = currentUserService.requireUserId();

        Shoe shoe = shoeRepository.findByIdAndUser_Id(id, userId)
                .orElseThrow(() -> new ShoeNotFoundException(id));

        if (shoe.getAccumulatedDistanceMeters() > 0) {
            throw new IllegalStateException(
                    "No se puede eliminar una zapatilla con historial. Utiliza la opción 'Retirar'.");
        }

        shoeRepository.delete(shoe);
    }

    /**
     * Exposición de sorts permitidos (útil para error messages o documentación).
     */
    public static java.util.Set<String> allowedSortKeys() {
        return java.util.Set.copyOf(ALLOWED_SORTS.keySet());
    }
}