package com.infodema.webcreator.domain.core;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import lombok.ToString;
import lombok.Setter;

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
