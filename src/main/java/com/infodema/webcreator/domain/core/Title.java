package com.infodema.webcreator.domain.core;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class Title {
    private String title;
    private String titleUrl;
}
