package com.infodema.webcreator.domain.core;

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
    private Integer linearPercentage;
    private String name;
    private String activeTopMenuUrl;
    private String activeSideMenuUrl;
    private String host;
    private Set<MainIso> iso;
    private Main main;
}
