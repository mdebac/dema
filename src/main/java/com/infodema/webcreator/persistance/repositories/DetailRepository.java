package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetailRepository extends JpaRepository<DetailEntity, Long> {
    void deleteByMain_Id(Long mainId);

    Optional<DetailEntity> findByTitleUrlAndMainId(String title, Long mainId);

    //@EntityGraph(attributePaths = "details")
    List<DetailEntity> findByMainIdOrderByMainAsc(Long mainId);

    Optional<DetailEntity> findById(Long id);

    long countByMain_Id(Long id);
}