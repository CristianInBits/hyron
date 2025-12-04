package dev.cristianinbits.hyron.gym.dto;

public record GymSetResponse(

    Long id,
    Integer setNumber,
    Integer reps,
    Float weight,
    Integer rpe,
    Integer restAfterSetSec,
    Boolean completed

) { }
