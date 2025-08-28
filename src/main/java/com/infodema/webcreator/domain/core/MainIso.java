package com.infodema.webcreator.domain.core;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MainIso {

    private String description;
    private String iso;
    private String iconText;
    private String title;
}
