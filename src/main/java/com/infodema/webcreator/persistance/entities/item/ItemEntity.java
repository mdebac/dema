package com.infodema.webcreator.persistance.entities.item;

import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import com.infodema.webcreator.domain.enums.Chip;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.io.IOUtils;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashSet;
import java.util.Set;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "item")
public class ItemEntity extends BaseAuditEntity {

    private String url;
    private Integer rowSpan;
    private Integer colSpan;
    private Integer cornerRadius;
    private Integer minHeight;
    private String backgroundColor;
    private Integer orderNum;
    private String shadowColor;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Chip chip;

    @ManyToOne
    @JoinColumn(name = "detail_id", nullable = false)
    private DetailEntity detail;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "item_iso",
            joinColumns = @JoinColumn(name = "item_id", nullable = false)
    )
    @Builder.Default
    private Set<ItemIsoEntity> iso = new HashSet<>();

    @SneakyThrows
    public void setImage(MultipartFile multipartFile){
        if(multipartFile != null){
            setFileName(multipartFile.getOriginalFilename());
            setMimeType(multipartFile.getContentType());
            setSize(multipartFile.getSize());
            setContent(IOUtils.toByteArray(multipartFile.getInputStream()) );
        }
    }

    private String fileName;
    private String mimeType;
    private long size;

    @Column(name = "content", columnDefinition="MEDIUMBLOB")
    private byte[] content;
}
