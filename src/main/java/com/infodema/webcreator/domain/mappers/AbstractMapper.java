package com.infodema.webcreator.domain.mappers;

import org.springframework.data.domain.Page;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

public abstract class AbstractMapper {

    public static <A, B> List<A> convertCollection(List<B> list, Function<B, A> convertFunction) {
        return Optional.ofNullable(list).orElseGet(Collections::emptyList).stream()
                .map(convertFunction)
                .collect(Collectors.toList());
    }

    public static <A, B> Set<A> convertCollection(Set<B> list, Function<B, A> convertFunction) {
        return Optional.ofNullable(list).orElseGet(Collections::emptySet).stream()
                .map(convertFunction)
                .collect(Collectors.toSet());
    }

    public static <A, B> Page<A> convertPageCollection(Page<B> entityList, Function<B, A> convertFunction) {
        return entityList.map(convertFunction);
    }
}
