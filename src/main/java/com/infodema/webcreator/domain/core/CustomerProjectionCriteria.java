package com.infodema.webcreator.domain.core;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class CustomerProjectionCriteria {
    private String role;
    private String host;
}
