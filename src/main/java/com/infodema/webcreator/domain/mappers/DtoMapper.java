package com.infodema.webcreator.domain.mappers;

import org.springframework.data.domain.Page;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/*
 * Single model to Dto mapping interface.
 * */
public interface DtoMapper<MODEL, DTO> {

    DTO toPresentation(MODEL model);

    MODEL toDomain(DTO dto);

    default Page<DTO> toPresentation(Page<MODEL> model) {
        return model.map(this::toPresentation);
    }

    default Page<MODEL> toDomain(Page<DTO> dto) {
        return dto.map(this::toDomain);
    }

    default List<DTO> toPresentation(List<MODEL> model) {
        return Optional.ofNullable(model).orElseGet(Collections::emptyList).stream()
                .map(this::toPresentation)
                .collect(Collectors.toList());
    }

    default List<MODEL> toDomain(List<DTO> dto) {
        return Optional.ofNullable(dto).orElseGet(Collections::emptyList).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    default Set<DTO> toPresentation(Set<MODEL> model) {
        return Optional.ofNullable(model).orElseGet(Collections::emptySet).stream()
                .map(this::toPresentation)
                .collect(Collectors.toSet());
    }

    default Set<MODEL> toDomain(Set<DTO> dto) {
        return Optional.ofNullable(dto).orElseGet(Collections::emptySet).stream()
                .map(this::toDomain)
                .collect(Collectors.toSet());
    }
}
