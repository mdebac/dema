package com.infodema.webcreator.services;

import com.infodema.webcreator.persistance.entities.CvDataEntity;
import com.infodema.webcreator.persistance.repositories.CvDataRepository;
import com.infodema.webcreator.domain.cv.CvData;
import com.infodema.webcreator.domain.cv.CvDataProjectionMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CvDataService {

    private final CvDataRepository cvDataRepository;
    private final CvDataProjectionMapper cvDataProjectionMapper;

    @SneakyThrows
    public ByteArrayResource getDocumentById(Long id)  {
        Optional<CvDataEntity> report = cvDataRepository.findById(id);
        if (report.isEmpty()) {
            throw new RuntimeException("CV log for id " + id + " does not exist");
        } else if (report.get().getContent() == null) {
            throw new RuntimeException("Report for CV log id " + id + " does not exist");
        }
        return new ByteArrayResource(report.get().getContent().getBinaryStream().readAllBytes());
    }


    public void deleteCvById(Long id) {
        cvDataRepository.deleteById(id);
    }


    public Page<CvData> fetchCvData(Pageable pageable) {
        return cvDataProjectionMapper.toDomain(cvDataRepository.allCvData(pageable));
    }

    @Transactional
    public Long saveCvData(CvData data, MultipartFile file) {
        CvDataEntity cvDataEntity;
        Optional<CvDataEntity> cvOptional = cvDataRepository.findByEmailAndItemId(data.getEmail(), data.getItemId());
        if (cvOptional.isPresent()) {
            cvDataEntity = cvOptional.get();
        } else {
            cvDataEntity = new CvDataEntity();
            cvDataEntity.setEmail(data.getEmail());
            cvDataEntity.setItemId(data.getItemId());
        }
        cvDataEntity.setFile(file);
        cvDataEntity.setName(data.getName());
        cvDataEntity.setCoverLetterText(data.getCoverLetterText());

        return cvDataRepository.save(cvDataEntity).getId();
    }
}
