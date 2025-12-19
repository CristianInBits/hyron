package dev.cristianinbits.hyron.common.validation;

import java.lang.annotation.Target;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Documented;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * Validation annotation that allows a String to be either null
 * or a non-blank value.
 *
 * This constraint is useful for partial update scenarios,
 * where fields are optional but must not be blank when provided.
 */
@Target({
        ElementType.FIELD,
        ElementType.PARAMETER,
        ElementType.RECORD_COMPONENT
})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NullOrNotBlankValidator.class)
@Documented
public @interface NullOrNotBlank {

    /**
     * Default validation message.
     *
     * @return the validation error message
     */
    String message() default "must be null or not blank";

    /**
     * Validation groups.
     *
     * @return the validation groups
     */
    Class<?>[] groups() default {};

    /**
     * Payload for clients of the Bean Validation API.
     *
     * @return the payload classes
     */
    Class<? extends Payload>[] payload() default {};
}