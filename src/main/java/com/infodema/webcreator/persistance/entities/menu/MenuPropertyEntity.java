package com.infodema.webcreator.persistance.entities.menu;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@RequiredArgsConstructor
@AllArgsConstructor
@Embeddable
@EqualsAndHashCode
@Data
public class MenuPropertyEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @EqualsAndHashCode.Exclude
    private String value;
}
