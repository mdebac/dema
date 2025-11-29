package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.enums.Country;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MainLanguage {
    private String iso;
}
