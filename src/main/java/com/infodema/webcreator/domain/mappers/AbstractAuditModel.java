package com.infodema.webcreator.domain.mappers;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import com.infodema.webcreator.domain.utility.Const;
import java.time.OffsetDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class AbstractAuditModel {
    protected Long id;

    @JsonFormat(pattern = Const.Format.ISO_DATE_TIME)
    protected OffsetDateTime createdOn;
    protected String createdBy;
    @JsonFormat(pattern = Const.Format.ISO_DATE_TIME)
    protected OffsetDateTime modifiedOn;
    protected String modifiedBy;
}

