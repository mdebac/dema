package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetailRepository extends JpaRepository<DetailEntity, Long> {
    void deleteByMenu_Id(Long mainId);

    Optional<DetailEntity> findByMenu_IdAndPanel_Id(Long menuId, Long panelId);


    //@EntityGraph(attributePaths = "details")
    //List<DetailEntity> findByMenuIdOrderByMainAsc(Long mainId);

    List<DetailEntity> findByMenu_Id(Long menuId);

    Optional<DetailEntity> findById(Long id);

    long countByMenu_Id(Long id);
}
