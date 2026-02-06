package com.infodema.webcreator.persistance.entities.main;

import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "product")
public class ProductEntity extends BaseAuditEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "main_id", nullable = false)
    private MainEntity main;

    @OneToMany(mappedBy = "product")
    // @Fetch(FetchMode.SUBSELECT)
    private Set<ProductPropertyEntity> properties;

}
