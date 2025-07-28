package com.infodema.webcreator.persistance.entities.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Null-safe Fund attribute converter
 */
@Converter
public class BooleanConverter implements AttributeConverter<Boolean, Integer> {
    @Override
    public Integer convertToDatabaseColumn(Boolean attribute) {
        if (attribute == null) {
            return 0;
        }
        if (attribute) {
            return 1;
        }else{
            return 0;
        }
    }

    @Override
    public Boolean convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return Boolean.FALSE;
        }
        if (dbData.equals(1)) {
            return Boolean.TRUE;
        }else{
            return Boolean.FALSE;
        }
    }
}
