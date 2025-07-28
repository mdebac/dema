package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.persistance.entities.detail.DetailIso;
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
