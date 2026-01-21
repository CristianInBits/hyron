package dev.cristianinbits.hyron.shoe.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import dev.cristianinbits.hyron.common.web.PageQuery;
import dev.cristianinbits.hyron.common.web.PageResult;
import dev.cristianinbits.hyron.shoe.domain.ShoeType;
import dev.cristianinbits.hyron.shoe.dto.ShoeCreateRequest;
import dev.cristianinbits.hyron.shoe.dto.ShoeResponse;
import dev.cristianinbits.hyron.shoe.dto.ShoeUpdateRequest;
import dev.cristianinbits.hyron.shoe.service.ShoeService;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/shoes")
@RequiredArgsConstructor
@Tag(name = "Shoes", description = "Gestión de zapatillas y seguimiento de kilometraje")
public class ShoeController {

    private final ShoeService shoeService;

    @PostMapping
    @Operation(summary = "Crear nueva zapatilla", description = "Crea una zapatilla asociada al usuario autenticado.")
    public ResponseEntity<ShoeResponse> create(@Valid @RequestBody ShoeCreateRequest request) {
        ShoeResponse response = shoeService.create(request);

        // BEST PRACTICE: Añadir header Location (ej: http://api.../v1/shoes/5)
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener zapatilla por ID")
    public ResponseEntity<ShoeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(shoeService.getById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar zapatilla", description = "PUT: reemplazo completo. Los campos opcionales pueden borrarse enviando null o cadena vacía.")
    public ResponseEntity<ShoeResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ShoeUpdateRequest request) {
        return ResponseEntity.ok(shoeService.update(id, request));
    }

    @GetMapping
    @Operation(summary = "Listar mis zapatillas", description = "Obtiene lista paginada con filtros opcionales.")
    public ResponseEntity<PageResult<ShoeResponse>> getMyShoes(
            
            @Parameter(description = "Filtrar por tipo (RUNNING, TRAIL, etc.)")
            @RequestParam(required = false) ShoeType type,

            @Parameter(description = "Estado: true (activas), false (retiradas), null (todas)")
            @RequestParam(required = false) Boolean active,

            // @ParameterObject "explota" el record PageQuery en campos individuales en Swagger UI
            @Valid 
            @ParameterObject 
            PageQuery pageQuery
    ) {
        return ResponseEntity.ok(shoeService.getMyShoes(type, active, pageQuery));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar zapatilla", description = "Soft delete: marca la zapatilla como inactiva.")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        shoeService.delete(id);
    }
}