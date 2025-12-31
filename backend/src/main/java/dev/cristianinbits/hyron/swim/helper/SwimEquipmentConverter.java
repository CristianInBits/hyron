package dev.cristianinbits.hyron.swim.helper;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import dev.cristianinbits.hyron.swim.domain.SwimEquipment;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class SwimEquipmentConverter implements AttributeConverter<Set<SwimEquipment>, String> {

    @Override
    public String convertToDatabaseColumn(Set<SwimEquipment> attribute) {
        if (attribute == null || attribute.isEmpty()) return null;
        return attribute.stream()
                .map(Enum::name)
                .sorted()
                .collect(Collectors.joining(","));
    }

    @Override
    public Set<SwimEquipment> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) return new HashSet<>();
        return Arrays.stream(dbData.split(","))
                .map(SwimEquipment::valueOf)
                .collect(Collectors.toSet());
    }
}