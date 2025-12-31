package dev.cristianinbits.hyron.gym.domain;

public enum GymSetType {
    WARMUP,   // Calentamiento (no cuenta para volumen)
    WORK,     // Serie efectiva normal
    FAILURE,  // Al fallo
    DROP_SET, // Descendente
    MYO_REP   // Opcional, para técnicas avanzadas
}