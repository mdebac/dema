package com.infodema.webcreator.domain.core;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Data;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class MainCriteria {
    private String chip;
    private Long userId;
    private String title;
    private String host;
}
