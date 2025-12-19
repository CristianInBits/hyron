package dev.cristianinbits.hyron.common.validation;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Validator implementation for {@link NullOrNotBlank}.
 *
 * Validates that a String value is either null or contains
 * at least one non-whitespace character.
 *
 * This validator is typically used for optional fields in
 * update requests, where null is allowed but blank values
 * are considered invalid.
 */
@Component
public class NullOrNotBlankValidator
        implements ConstraintValidator<NullOrNotBlank, String> {

    /**
     * Validates the given value.
     *
     * @param value the value to validate
     * @param context the validation context
     * @return true if the value is null or not blank, false otherwise
     */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null || !value.isBlank();
    }
}