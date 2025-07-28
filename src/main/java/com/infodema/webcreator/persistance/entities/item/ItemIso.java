package com.infodema.webcreator.persistance.entities.item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@RequiredArgsConstructor
@AllArgsConstructor
@Data
public class ItemIso {
    private String description;
    private String title;
    private String iso;
}
