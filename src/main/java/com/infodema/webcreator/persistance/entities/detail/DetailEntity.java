package com.infodema.webcreator.persistance.entities.detail;

import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.item.ItemEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import com.infodema.webcreator.persistance.entities.panel.PanelEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.type.TrueFalseConverter;
import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "detail",
        uniqueConstraints=
        @UniqueConstraint(columnNames={"panel_id", "menu_id"}))
public class DetailEntity extends BaseAuditEntity {

    @ManyToOne
    @JoinColumn(name = "panel_id", nullable = false)
    private PanelEntity panel;

    @ManyToOne
    @JoinColumn(name = "menu_id", nullable = false)
    private MenuEntity menu;

    private Integer columns;
    private Integer cornerRadius;
    @Convert(converter = TrueFalseConverter.class)
    private Boolean showProgram;

    private String backgroundColor;

   @OneToMany(mappedBy = "detail")
   //@Fetch(FetchMode.SUBSELECT)
   private List<ItemEntity>  items;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "detail_iso",
            joinColumns = @JoinColumn(name = "detail_id", nullable = false)
    )
    @Builder.Default
    private Set<DetailIsoEntity> iso = new HashSet<>();
}
