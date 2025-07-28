package com.infodema.webcreator.persistance.entities.main;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MainIso {

    private String text;
    private String title;
    private String iso;
    private String iconText;
    private String iconTitle;
}