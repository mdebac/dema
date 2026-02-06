package com.infodema.webcreator.services;

import com.infodema.webcreator.domain.core.ProductProperty;
import com.infodema.webcreator.domain.core.ProductType;
import com.infodema.webcreator.domain.mappers.*;
import com.infodema.webcreator.persistance.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductPropertyRepository productPropertyRepository;

    @Transactional
    public ProductType createUpdateProductType(ProductType payload) {
        if (payload.getId() != null) {
            var product = productRepository.findById(payload.getId()).orElseThrow(() -> new EntityNotFoundException("No Product found with id:" + payload.getId()));
            productMapper.updateEntityByModel(product, payload);
            return productMapper.toDomain(productRepository.save(product));
        } else {
            return productMapper.toDomain(productRepository.save(productMapper.toEntity(payload)));
        }
    }

    @Transactional
    public ProductProperty createUpdateProductProperty(ProductProperty payload) {
        if (payload.getId() != null) {
            var productProperty = productPropertyRepository.findById(payload.getId()).orElseThrow(() -> new EntityNotFoundException("No Product Property found with id:" + payload.getId()));
            productMapper.updatePropertyEntityByModel(productProperty, payload);
            return productMapper.toDomainProductProperty(productPropertyRepository.save(productProperty));
        } else {
            return productMapper.toDomainProductProperty(productPropertyRepository.save(productMapper.toEntityProductProperty(payload)));
        }
    }

    @Transactional(readOnly = true)
    public Set<ProductType> fetchProducts(Long mainId) {
        return productMapper.toDomain(productRepository.findByMain_Id(mainId));
    }

    @Transactional
    public void deleteProductById(Long productId) {
        productPropertyRepository.deleteByProduct_Id(productId);
        productRepository.deleteById(productId);
    }

    @Transactional
    public void deleteProductsByMain_Id(Long mainId) {
        productRepository.findByMain_Id(mainId).forEach(product -> deleteProductById(product.getId()));
    }

    @Transactional
    public void deleteProperty(Long propertyId) {
        productPropertyRepository.deleteById(propertyId);
    }


}
