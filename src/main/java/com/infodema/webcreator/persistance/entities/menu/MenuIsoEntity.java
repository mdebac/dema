package com.infodema.webcreator.persistance.entities.menu;


import com.infodema.webcreator.domain.enums.Country;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class MenuIsoEntity {

    @EqualsAndHashCode.Exclude
    private String description;

    @EqualsAndHashCode.Exclude
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Country iso;
}
