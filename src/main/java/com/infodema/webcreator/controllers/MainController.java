package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.core.*;
import com.infodema.webcreator.domain.projections.MainProjection;
import com.infodema.webcreator.domain.utility.UtilityHelper;
import com.infodema.webcreator.services.MainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
public class MainController {

    private final MainService mainService;

    @GetMapping("/find")
    public ResponseEntity<Page<MainProjection>> findAllApartments(MainCriteria criteria, Pageable pageable) {
        log.debug("findAllApartments by criteria={}, pageable={}", criteria, pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(mainService.findMains(criteria, pageable));
    }

    @GetMapping(value = "/find/header")
    public ResponseEntity<Header> fetchHeader(
            @RequestHeader("Host") String host
    ) {
        log.debug("fetchHeader by host={}", host);

        return ResponseEntity.status(HttpStatus.OK)
                .body(mainService.findHeaderByHost(UtilityHelper.resolveHostForDevelopment(host)));
    }


    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @GetMapping("/customers")
    public ResponseEntity<Page<Main>> findCustomers(@RequestHeader("Host") String host,
                                                    Pageable pageable) {
        log.info("findCustomers by Main pageable={}", pageable);
        return ResponseEntity.status(HttpStatus.OK)
                .body(mainService.findCustomers(UtilityHelper.resolveHostForDevelopment(host), pageable));
    }

    @GetMapping("/find/domains")
    public ResponseEntity<Page<Main>> findDomains(Pageable pageable) {
        log.info("findDomains by pageable={}", pageable);
        return ResponseEntity.status(HttpStatus.OK).body(mainService.findDomains(pageable));
    }

    @GetMapping("/find/hotels")
    public ResponseEntity<Page<Main>> findHotels(
            @RequestHeader("Host") String host,
            HotelCriteria criteria,
            Pageable pageable) {
        log.info("findHotels by pageable={}", pageable);
        return ResponseEntity.status(HttpStatus.OK).body(mainService.findHotels(UtilityHelper.resolveHostForDevelopment(host), pageable, criteria));
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteApartment(@PathVariable Long id,
                                         @RequestHeader("Host") String host) {
        mainService.deleteMain(id, host);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(path = "/report", produces = "application/vnd.ms-excel")
    public ResponseEntity<ByteArrayResource> listExport(MainCriteria criteria) {
        ByteArrayResource resource = null;// = apartmentService.exportXls(criteria);

        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("application/vnd.ms-excel"))
                .body(resource);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Main> getById(@PathVariable("id") Long id) {
        Main main = mainService.findById(id);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(main.getId())
                .toUri();
        return ResponseEntity.created(location).body(main);
    }

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @PostMapping
    public ResponseEntity<Void> create(@RequestPart Main payload,
                                       @RequestPart(value = "file", required = false) MultipartFile file,
                                       @RequestPart(value = "fileBg", required = false) MultipartFile fileBg) {
        mainService.saveMain(payload, file, fileBg);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/users/{userId}/roles/{role}")
    ResponseEntity<Void> updateUserRole(@PathVariable Long userId,
                                        @PathVariable String role) {
        mainService.updateUserRole(userId, role);
        return ResponseEntity.noContent().build();
    }

}
