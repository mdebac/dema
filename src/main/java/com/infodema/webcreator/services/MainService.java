package com.infodema.webcreator.services;

import com.infodema.webcreator.domain.core.Detail;
import com.infodema.webcreator.domain.mappers.DetailMapper;
import com.infodema.webcreator.domain.mappers.MainMapper;
import com.infodema.webcreator.domain.core.Main;
import com.infodema.webcreator.persistance.entities.detail.DetailIso;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.repositories.DetailRepository;
import com.infodema.webcreator.persistance.repositories.MainRepository;
import com.infodema.webcreator.domain.projections.MainProjection;
import com.infodema.webcreator.controllers.MainCriteria;
import com.infodema.webcreator.persistance.entities.security.User;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class MainService {

    private final MainRepository mainRepository;
    private final DetailRepository detailRepository;
    private final MainMapper mainMapper;
    private final AuditorAware<User> auditorAware;
    private final DetailMapper detailMapper;
    private final DetailsService detailsService;

    public Page<MainProjection> findMains(MainCriteria criteria, Pageable pageable) {
        return mainRepository.findMainsByCriteria(criteria, pageable);
    }

    public Page<Main> findMyMains(Pageable pageable) {
        return mainMapper.toDomain(mainRepository.findByOwner(auditorAware.getCurrentAuditor().orElseThrow(() -> new RuntimeException("LoggedIn user Not Found not found")), pageable));
    }

    @Transactional
    public void deleteMain
(Long id) {
        detailRepository.deleteByMain_Id(id);
        mainRepository.deleteById(id);
    }

    public Main findById(Long id) {
        return mainMapper.toDomain(mainRepository.findById(id).orElseThrow(() -> new RuntimeException("Main was not found with id [" + id + "]")));
    }

    @Transactional
    public Main saveMain(Main main, MultipartFile file) {
        main.setOwner(auditorAware.getCurrentAuditor().orElseThrow());

        MainEntity entity = mainMapper.toEntity(main);
        if (file != null) {
            entity.setImage(file);
        }else{
            mainRepository.findById(main.getId()).ifPresent(current -> {
                entity.setFileName(current.getFileName());
                entity.setMimeType(current.getMimeType());
                entity.setSize(current.getSize());
                entity.setContent(current.getContent());
            });
        }
        Main savedMain = mainMapper.toDomain(mainRepository.save(entity));

        if (main.getId() == null) {
            //create default detail
            detailsService.addToMain(
                    savedMain.getId(),
                    Detail.builder()
                            .host(savedMain.getHost())
                            .mainId(savedMain.getId())
                            .icon("favorite")
                            .titleUrl("test")
                            .columns(1)
                            .show(false)
                            .iso(Collections.singleton(DetailIso.builder()
                                    .iso("GB-eng")
                                    .label("Test")
                                    .title("Test title")
                                    .build()))
                            .build()
            );
        }

        return savedMain;
    }

    public Detail findDetailById(Long id) {
        return detailMapper.toDomain(detailRepository.findById(id).orElseThrow(() -> new RuntimeException("Detail not found")));
    }

}
