package com.infodema.webcreator.persistance.entities.detail;

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
@Embeddable
@EqualsAndHashCode
@Data
public class DetailIsoEntity {

    @EqualsAndHashCode.Exclude
    private String label;

    @EqualsAndHashCode.Exclude
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Country iso;
}
