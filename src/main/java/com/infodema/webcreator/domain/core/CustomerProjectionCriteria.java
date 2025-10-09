package com.infodema.webcreator.domain.core;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class CustomerProjectionCriteria {
    private String role;
    private String host;
}
