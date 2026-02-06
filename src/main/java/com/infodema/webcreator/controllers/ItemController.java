package com.infodema.webcreator.controllers;

import com.infodema.webcreator.services.ItemService;
import com.infodema.webcreator.domain.core.Item;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ItemController {

    private final ItemService itemService;

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @PostMapping("/{detailId}/items")
    public ResponseEntity<Item> create(
            @PathVariable("detailId") Long detailId,
            @Valid @RequestPart Item payload,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        Item model =
                itemService.newItem(detailId, payload, file);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(model.getId())
                .toUri();

        return ResponseEntity.created(location).body(model);
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @PutMapping("/{detailId}/items")
    public ResponseEntity<Item> update(
            @PathVariable("detailId") Long detailId,
            @Valid @RequestPart Item payload,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        Item model =
                itemService.updateItem(detailId, payload, file);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(model.getId())
                .toUri();

        return ResponseEntity.created(location).body(model);
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> remove(@PathVariable("id") Long id) {
        itemService.removeItem(id);
        return ResponseEntity.noContent().build();
    }

 /*   @PutMapping("/{detailId}/items/{id}")
    public ApartmentItem update(
            @PathVariable("detailId") Long detailId,
            @PathVariable("id") Long id,
            @Valid @RequestBody ApartmentItem item,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        return apartmentItemService.updateItem(detailId, id, item, file);
    }
*/
}
