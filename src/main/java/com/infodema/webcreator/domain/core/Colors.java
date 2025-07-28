package com.infodema.webcreator.domain.core;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Colors {
    private String primaryColor;
    private String secondaryColor;
    private String primaryColorLight;
    private String secondaryColorLight;
    private String warnColor;
    private String warnColorLight;
    private String infoColor;
    private String infoColorLight;
    private String acceptColor;
    private String acceptColorLight;
    private String dangerColor;
    private String dangerColorLight;
}
