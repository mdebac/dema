package com.infodema.webcreator.persistance.entities;

import com.infodema.webcreator.domain.utility.SecurityUtils;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.OffsetDateTime;

@NoArgsConstructor
@MappedSuperclass
@Getter
@Setter
@SuperBuilder(toBuilder = true)
public abstract class BaseAuditEntity {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "CREATED_ON", nullable = false, updatable = false)
    private OffsetDateTime createdOn;

    @Column(name = "CREATED_BY", nullable = false, updatable = false)
    private String createdBy;

    @Column(name = "MODIFIED_ON")
    private OffsetDateTime modifiedOn;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    /** to automatically fill in the audit columns before the creation of the entity */
    @PrePersist
    protected void setupCreateAudit() {
        this.createdBy = SecurityUtils.getUserName();
        this.createdOn = OffsetDateTime.now();
    }

    /** to automatically fill in the audit columns before the update of the entity */
    @PreUpdate
    protected void setupUpdateAudit() {
        this.modifiedBy = SecurityUtils.getUserName();
        this.modifiedOn = OffsetDateTime.now();
    }
}
