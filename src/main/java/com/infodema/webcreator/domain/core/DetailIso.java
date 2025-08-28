package com.infodema.webcreator.domain.core;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DetailIso {

    private String label;
    private String title;
    private String iso;
}
