package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.panel.PanelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PanelRepository extends JpaRepository<PanelEntity, Long> {
    Optional<PanelEntity> findById(Long id);
    void deleteByMenu_Id(Long menuId);
    long countByMenu_Id(Long menuId);
}
