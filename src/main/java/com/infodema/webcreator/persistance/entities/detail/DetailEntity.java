package com.infodema.webcreator.persistance.entities.detail;

import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.entities.item.ItemEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.type.TrueFalseConverter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "detail",
        uniqueConstraints=
        @UniqueConstraint(columnNames={"title_url", "main_id"}))
public class DetailEntity extends BaseAuditEntity {

    private String icon;
    @Column(nullable = false)
    private String titleUrl;
    private Integer columns;

    @Convert(converter = TrueFalseConverter.class)
    private Boolean showProgram;

    @ManyToOne
    @JoinColumn(name = "main_id", nullable = false)
    private MainEntity main;

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
