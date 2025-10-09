package com.infodema.webcreator.persistance.entities.panel;

import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.HashSet;
import java.util.Set;

@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "panel")
public class PanelEntity extends BaseAuditEntity {

    private String icon;
    private Integer orderNum;

    @ManyToOne
    @JoinColumn(name = "menu_id", nullable = false)
    private MenuEntity menu;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "panel_iso",
            joinColumns = @JoinColumn(name = "panel_id", nullable = false)
    )
    @Builder.Default
    private Set<PanelIsoEntity> iso = new HashSet<>();

    @Transient
    public String getPanelUrl() {
        return this.iso.stream().filter(iso-> iso.getIso().equals(Country.EN)).findFirst().orElseThrow(() -> new RuntimeException("panel URL not found")).getTitle().toLowerCase().replace(" ","_");
    }

}
