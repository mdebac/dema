package com.infodema.webcreator.domain.core;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@RequiredArgsConstructor
@AllArgsConstructor
@Data
public class MenuIso {
    private String description;
    private String title;
    private String iso;
}
