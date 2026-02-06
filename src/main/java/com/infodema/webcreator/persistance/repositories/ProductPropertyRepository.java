package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.main.ProductPropertyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductPropertyRepository extends JpaRepository<ProductPropertyEntity, Long> {
    Optional<ProductPropertyEntity> findById(Long id);
    void deleteByProduct_Id(Long productId);
}
