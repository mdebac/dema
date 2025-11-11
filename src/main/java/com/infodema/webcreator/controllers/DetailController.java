package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.utility.UtilityHelper;
import com.infodema.webcreator.services.DetailsService;
import com.infodema.webcreator.domain.core.Detail;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class DetailController {

    private final DetailsService detailsService;

    @GetMapping(value = "/find/details")
    public ResponseEntity<Detail> fetchDetailPage(
            @RequestParam("menuUrl") String menuUrl,
            @RequestParam("panelUrl") String panelUrl,
            @RequestHeader("Host") String host
    ) {
        log.info("fetchDetailPage by menuUrl={}, panelUrl={}", menuUrl, panelUrl);

        return ResponseEntity.status(HttpStatus.OK)
                .body(detailsService.findDetailByUrlLabels(UtilityHelper.resolveHostForDevelopment(host), menuUrl, panelUrl));
    }

    @GetMapping(value = "/detail/{detailId}")
    public ResponseEntity<Detail> fetchDetailByDetailId(
            @PathVariable("detailId") Long detailId
    ) {
        log.debug("fetchDetailByDetailId by detailId={}", detailId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(detailsService.findDetailByDetailId(detailId));
    }

    @PostMapping("/details")
    public ResponseEntity<Detail> create(
            @RequestPart("payload") Detail payload,
            @RequestPart(value = "top", required = false) MultipartFile top,
            @RequestPart(value = "side", required = false) MultipartFile side
    ) {
        Detail detail = detailsService.create(payload,top,side);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(detail.getId())
                .toUri();
       return ResponseEntity.created(location).body(detail);
    }

    @DeleteMapping("/{mainId}/{menuId}/{panelId}/details/{detailId}")
    public ResponseEntity<Void> remove(
            @PathVariable("mainId") Long mainId,
            @PathVariable("menuId") Long menuId,
            @PathVariable("panelId") Long panelId,
            @PathVariable("detailId") Long detailId) {
        detailsService.removeDetail(mainId, menuId, panelId, detailId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/details")
    public Detail update(
            @RequestPart Detail detail,
            @RequestPart(value = "top", required = false) MultipartFile top,
            @RequestPart(value = "side", required = false) MultipartFile side
    ) {
        return detailsService.updateDetail(detail, top, side);
    }

}
