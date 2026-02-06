package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.core.*;
import com.infodema.webcreator.domain.mappers.ProductMapper;
import com.infodema.webcreator.persistance.repositories.ProductPropertyRepository;
import com.infodema.webcreator.persistance.repositories.ProductRepository;
import com.infodema.webcreator.services.MenuService;
import com.infodema.webcreator.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Set;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductPropertyRepository productPropertyRepository;
    private final MenuService menuService;

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @GetMapping(value = "/products/{mainId}")
    public ResponseEntity<Set<ProductType>> fetchProducts(@PathVariable Long mainId) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.fetchProducts(mainId));
    }


    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @PutMapping("/product")
    public ResponseEntity<Set<ProductType>> createUpdateProduct(
            @Valid @RequestPart ProductType payload) {
        ProductType product =
                productService.createUpdateProductType(payload);

        Set<ProductType> model = productService.fetchProducts(product.getMainId());

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(product.getId())
                .toUri();

        return ResponseEntity.created(location).body(model);
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @PutMapping("/product-property")
    public ResponseEntity<Set<ProductType>> createUpdateProperty(
            @Valid @RequestPart ProductProperty payload) {

        ProductProperty productProperty =
                productService.createUpdateProductProperty(payload);

        ProductType product = productMapper.toDomain(productRepository.findById(productProperty.getProductId()).orElseThrow());
        Set<ProductType> model = productService.fetchProducts(product.getMainId());

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(productProperty.getId())
                .toUri();

        return ResponseEntity.created(location).body(model);
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @DeleteMapping("{mainId}/product/{id}")
    public ResponseEntity<Set<ProductType>> removeProduct(
            @PathVariable("id") Long id,
            @PathVariable("mainId") Long mainId) {
        productService.deleteProductById(id);
        Set<ProductType> model = productService.fetchProducts(mainId);
        return ResponseEntity.ok().body(model);
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @DeleteMapping("{mainId}/product-property/{id}")
    public ResponseEntity<Set<ProductType>> removeProperty(@PathVariable("id") Long id,
                                                           @PathVariable("mainId") Long mainId) {
        productService.deleteProperty(id);
        Set<ProductType> model = productService.fetchProducts(mainId);
        return ResponseEntity.ok().body(model);
    }

    @GetMapping("/find/menu-products")
    public ResponseEntity<Page<Menu>> findMenuProducts(MenuProductCriteria criteria, Pageable pageable) {
        log.debug("findMenuProducts by criteria={}, pageable={}", criteria, pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(menuService.findMenuProducts(criteria, pageable));
    }

}
