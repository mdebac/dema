package com.infodema.webcreator.persistance.entities.payments;
import com.infodema.webcreator.domain.enums.AddressType;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@RequiredArgsConstructor
@AllArgsConstructor
@Embeddable
@EqualsAndHashCode
@Data
public class AddressEntity {
    @EqualsAndHashCode.Exclude
    private String street;
    @EqualsAndHashCode.Exclude
    private String city;
    @EqualsAndHashCode.Exclude
    private String state;
    @EqualsAndHashCode.Exclude
    private String country;
    @EqualsAndHashCode.Exclude
    private String zipCode;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AddressType addressType;
}


