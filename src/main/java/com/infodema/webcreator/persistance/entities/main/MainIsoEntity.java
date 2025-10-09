package com.infodema.webcreator.persistance.entities.main;

import com.infodema.webcreator.domain.enums.Country;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
@Data
public class MainIsoEntity {

    @EqualsAndHashCode.Exclude
    @Column(length = 2000)
    private String description;

    @EqualsAndHashCode.Exclude
    @Column(length = 30)
    private String iconText;

    @EqualsAndHashCode.Exclude
    @Column(length = 15)
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Country iso;
}
