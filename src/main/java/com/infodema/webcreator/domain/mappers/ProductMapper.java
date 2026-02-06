package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.ProductProperty;
import com.infodema.webcreator.domain.core.ProductType;
import com.infodema.webcreator.persistance.entities.main.ProductEntity;
import com.infodema.webcreator.persistance.entities.main.ProductPropertyEntity;
import com.infodema.webcreator.persistance.repositories.MainRepository;
import com.infodema.webcreator.persistance.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class ProductMapper extends AbstractMapper {

    private final MainRepository mainRepository;
    private final ProductRepository productRepository;

    public Set<ProductProperty> toDomainProductProperty(Set<ProductPropertyEntity> entities) {
        return convertCollection(entities, this::toDomainProductProperty);
    }

    public Set<ProductPropertyEntity> toEntityProductProperty(Set<ProductProperty> entities) {
        return convertCollection(entities, this::toEntityProductProperty);
    }

    public Set<ProductType> toDomain(Set<ProductEntity> entities) {
        return convertCollection(entities, this::toDomain);
    }

    public Set<ProductEntity> toEntity(Set<ProductType> productTypes) {
        return convertCollection(productTypes, this::toEntity);
    }

    public ProductType toDomain(ProductEntity entity) {
        return ProductType.builder()
                .id(entity.getId())
                .mainId(entity.getMain().getId())
                .createdOn(entity.getCreatedOn())
                .createdBy(entity.getCreatedBy())
                .modifiedOn(entity.getModifiedOn())
                .modifiedBy(entity.getModifiedBy())
                .name(entity.getName())
                .properties(toDomainProductProperty(entity.getProperties()))
                .build();
    }

    public ProductEntity toEntity(ProductType product) {
        return ProductEntity.builder()
                .id(product.getId())
                .name(product.getName())
                .main(mainRepository.findById(product.getMainId()).orElseThrow())
                .properties(toEntityProductProperty(product.getProperties()))
                .createdOn(product.getCreatedOn())
                .createdBy(product.getCreatedBy())
                .modifiedOn(product.getModifiedOn())
                .modifiedBy(product.getModifiedBy())
                .build();
    }

    public ProductProperty toDomainProductProperty(ProductPropertyEntity entity) {
        return ProductProperty.builder()
                .name(entity.getName())
                .type(entity.getType())
                .unit(entity.getUnit())
                .id(entity.getId())
                .productId(entity.getProduct().getId())
                .build();
    }

    public ProductPropertyEntity toEntityProductProperty(ProductProperty property) {
        return ProductPropertyEntity.builder()
                .name(property.getName())
                .unit(property.getUnit())
                .id(property.getId())
                .product(productRepository.findById(property.getProductId()).orElseThrow())
                .type(property.getType())
                .build();
    }

    public void updateEntityByModel(ProductEntity entity, ProductType payload) {
        if (payload.getProperties() != null) {
            entity.setProperties(this.toEntityProductProperty(payload.getProperties()));
        }
        entity.setName(payload.getName());
    }

    public void updatePropertyEntityByModel(ProductPropertyEntity entity, ProductProperty payload) {
        entity.setUnit(payload.getUnit());
        entity.setName(payload.getName());
        entity.setType(payload.getType());
    }

}
