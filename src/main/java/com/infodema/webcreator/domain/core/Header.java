package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.persistance.entities.main.MainEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Header {
    private Long id;
    private List<Menu> menus;
    private List<String> languages;
    private Integer linearPercentage;
    private String name;
    private String activeTopMenuUrl;
    private String activeSideMenuUrl;
    private String host;
    private Colors colors;
    private Set<MainIso> iso;
    private Main main;
}
