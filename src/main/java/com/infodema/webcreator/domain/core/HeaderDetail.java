package com.infodema.webcreator.domain.core;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class HeaderDetail{
    private String detailUrl;
    private String icon;
    private Set<DetailIso> iso;
}
