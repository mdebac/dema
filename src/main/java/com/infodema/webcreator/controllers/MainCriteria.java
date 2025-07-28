package com.infodema.webcreator.controllers;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class MainCriteria {

    private String chip;
    private Long userId;
    private String title;
}
