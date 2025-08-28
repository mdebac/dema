package com.infodema.webcreator.controllers;

import com.infodema.webcreator.services.DetailsService;
import com.infodema.webcreator.domain.core.Detail;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
            @RequestParam("host") String host,
            @RequestParam("detailUrl") String detailUrl
    ) {
        log.debug("fetchDetailPage by host={}, detailUrl={}", host, detailUrl);

     return ResponseEntity.status(HttpStatus.OK)
           .body( detailsService.findDetailByUrlLabels(host, detailUrl));
    }

    @GetMapping(value = "/detail/{detailId}")
    public ResponseEntity<Detail> fetchDetailByDetailId(
            @PathVariable("detailId") Long detailId
    ) {
        log.debug("fetchDetailByDetailId by detailId={}", detailId);

        return ResponseEntity.status(HttpStatus.OK)
                .body( detailsService.findDetailByDetailId(detailId));
    }


    @PostMapping("/{apartmentId}/details")
    public ResponseEntity<Detail> add(
            @PathVariable("apartmentId") Long apartmentId, @Valid @RequestBody Detail detail) {
        Detail model =
                detailsService.addToMain(apartmentId, detail);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(model.getId())
                .toUri();

        return ResponseEntity.created(location).body(model);
    }

    @DeleteMapping("/{apartmentId}/details/{id}")
    public ResponseEntity<Void> remove(@PathVariable("apartmentId") Long mainId, @PathVariable("id") Long id) {

        detailsService.removeFromMain(mainId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{apartmentId}/details/{id}")
    public Detail update(
            @PathVariable("apartmentId") Long apartmentId,
            @PathVariable("id") Long id,
            @Valid @RequestBody Detail detail) {

        return detailsService.updateInMain(apartmentId, id, detail);
    }

}
