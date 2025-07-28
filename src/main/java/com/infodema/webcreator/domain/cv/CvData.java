package com.infodema.webcreator.domain.cv;

import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.sql.Blob;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CvData extends AbstractAuditModel {

    //candidate data
    private String name;
    private String email;
    private String coverLetterText;
    private Long itemId;

    //file data
    private String fileName;
    private String mimeType;
    private long size;
    private Blob content;

}
