package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.persistance.entities.main.MainIso;
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
    private List<HeaderDetail> detail;
    private List<String> languages;
    private byte[] iconImage;
    private String name;
    private String activeDetailUrl;
    private String apartmentUrl;
    private Colors colors;
    private Set<MainIso> iso;
}