package com.infodema.webcreator.domain.cv;

import com.infodema.webcreator.domain.mappers.AbstractMapper;
import com.infodema.webcreator.domain.utility.UtilityHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CvDataProjectionMapper extends AbstractMapper {

    public Page<CvData> toDomain(Page<CvDataProjection> entities) {
        return convertPageCollection(entities, this::toDomain);
    }

    public List<CvData> toDomain(List<CvDataProjection> entities) {
        return convertCollection(entities, this::toDomain);
    }

    public CvData toDomain(CvDataProjection entity) {
        return CvData.builder()
                .id(entity.getId())
                .createdOn(UtilityHelper.toOffsetDateTime(entity.getCreatedOn()))
                .name(entity.getName())
                .email(entity.getEmail())
                .coverLetterText(entity.getCoverLetterText())
                .fileName(entity.getFileName())
                .mimeType(entity.getMimeType())
                .build();
    }

}
