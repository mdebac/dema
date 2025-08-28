package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.core.Header;
import com.infodema.webcreator.domain.core.Main;
import com.infodema.webcreator.domain.core.MainCriteria;
import com.infodema.webcreator.domain.core.Message;
import com.infodema.webcreator.domain.projections.MainProjection;
import com.infodema.webcreator.services.MainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1")
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

    @GetMapping(value = "/find/{host}/header")
    public ResponseEntity<Header> fetchHeader(
            @PathVariable("host") String host
    ) {
        log.debug("fetchHeader by host={}", host);

        return ResponseEntity.status(HttpStatus.OK)
                .body( mainService.findHeaderByHost(host));
    }


    @GetMapping("/customers/{host}")
    public ResponseEntity<Page<Main>> findCustomers(
            @PathVariable("host") String host,
            Pageable pageable) {

        log.info("findCustomers by Main pageable={}", pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(mainService.findCustomers(host, pageable));
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

  /* @GetMapping(path = "/api/v1/ping", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> generateUrl() {
        //log.debug("generateUrl by title={}", title);
        System.out.println("ping");
        return new ResponseEntity<>(
                Message.builder().text("pong").build(),
                HttpStatus.OK);
    }*/


    @GetMapping(path = "/report",produces = "application/vnd.ms-excel")
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
