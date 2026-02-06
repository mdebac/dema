package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.main.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    Optional<ProductEntity> findById(Long id);
    Set<ProductEntity> findByMain_Id(Long mainId);

}
