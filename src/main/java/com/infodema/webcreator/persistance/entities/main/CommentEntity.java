package com.infodema.webcreator.persistance.entities.main;

import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "comment")
public class CommentEntity extends BaseAuditEntity {

    @Column
    private Double note;

    private String comment;

    @ManyToOne
    @JoinColumn(name = "main_id", nullable = false)
    private MainEntity main;
}
