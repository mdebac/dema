package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.core.Main;
import com.infodema.webcreator.domain.projections.MainProjection;
import com.infodema.webcreator.services.MainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
@Slf4j
public class MainController {

    private final MainService mainService;

    @GetMapping("/find")
    public ResponseEntity<Page<MainProjection>> findAllApartments(MainCriteria criteria, Pageable pageable) {
        log.debug("findAllApartments by criteria={}, pageable={}", criteria, pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body( mainService.findMains(criteria,pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<Main>> findMyApartments(Pageable pageable) {
        log.info("findMyApartments by pageable={}", pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(mainService.findMyMains(pageable));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteApartment(@PathVariable Long id) {
        System.out.println("delete Main - " + id);
        mainService.deleteMain(id);
        return ResponseEntity.noContent().build();
    }

   /* @PutMapping()
    public ResponseEntity<Main> updateApartment(
            @RequestPart Main Main, @RequestPart(value = "file") MultipartFile file) {
        return ResponseEntity.ok(apartmentService.saveApartment(Main, file));
    }*/

    @GetMapping(produces = "application/vnd.ms-excel")
    public ResponseEntity<ByteArrayResource> listExport(MainCriteria criteria) {
        ByteArrayResource resource = null;// = apartmentService.exportXls(criteria);

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("application/vnd.ms-excel"))
                .body(resource);
    }

    @GetMapping(value = "/{id}")
    public Main getById(@PathVariable("id") Long id) {
        return mainService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Main> create(@RequestPart Main payload, @RequestPart(value = "file", required = false) MultipartFile file) {

        Main main = mainService.saveMain(payload, file);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(main.getId())
                .toUri();

        return ResponseEntity.created(location).body(main);
    }

}
