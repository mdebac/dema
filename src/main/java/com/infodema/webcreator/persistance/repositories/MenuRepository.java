package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<MenuEntity, Long> {
    Optional<MenuEntity> findById(Long id);
    Long countByMain_Id(Long mainId);
    void deleteByMain_Id(Long mainId);
}
