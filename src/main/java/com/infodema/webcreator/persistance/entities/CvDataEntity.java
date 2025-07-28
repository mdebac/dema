package com.infodema.webcreator.persistance.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.engine.jdbc.BlobProxy;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Blob;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cv_data",
        uniqueConstraints=
        @UniqueConstraint(columnNames={"email", "item_id"}))
public class CvDataEntity extends BaseAuditEntity {

    private String name;
    private String email;
    private String coverLetterText;
    private Long itemId;

    @NotBlank
    private String fileName;
    @NotNull
    private String mimeType;
    private long size;
    @Lob
    @NotNull
    private Blob content;

    @SneakyThrows
    public void setFile(MultipartFile multipartFile){
        if(multipartFile != null){
            setFileName(multipartFile.getOriginalFilename());
            setMimeType(multipartFile.getContentType());
            setSize(multipartFile.getSize());
            setContent(BlobProxy.generateProxy(multipartFile.getInputStream(), multipartFile.getSize()));
        }
    }

}
