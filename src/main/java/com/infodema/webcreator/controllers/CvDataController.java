package com.infodema.webcreator.controllers;

import com.infodema.webcreator.services.CvDataService;
import com.infodema.webcreator.domain.cv.CvData;
import com.infodema.webcreator.domain.recaptcha.RequiresCaptcha;
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
@RequestMapping("/documents")
@RequiredArgsConstructor
@Slf4j
public class CvDataController {

    private final CvDataService cvDataService;

    @GetMapping
    public ResponseEntity<Page<CvData>> findAllCvs(
            @RequestParam(name = "page") Integer page,
            @RequestParam(name = "size") Integer size,
            @RequestParam(name = "sort") String sort
    ) {
        // log.debug("findAllCvs by pageable={}", pageable);

        Sort sortBy = sortBy(sort);
        Pageable pageable = PageRequest.of(page, size).withSort(sortBy);
        return ResponseEntity.status(HttpStatus.OK)
                .body( cvDataService.fetchCvData(pageable));
    }

    private Sort sortBy(String sortIn) {
        Sort sortBy;
        String[] sort = sortIn.split(",");
        if (sort[1].toLowerCase().equals("desc")) {
            sortBy = Sort.by(sort[0]).descending();
        } else {
            sortBy = Sort.by(sort[0]).ascending();
        }
        return sortBy;
    }


    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteCv(@PathVariable Long id) {
        System.out.println("delete CvById - " + id);
        cvDataService.deleteCvById(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/download/{id}")
    public ResponseEntity<ByteArrayResource> downloadReport(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_PDF)
                .body(cvDataService.getDocumentById(id));
    }


    @RequiresCaptcha
    @PostMapping
    public ResponseEntity<Void> create(@RequestPart CvData payload, @RequestPart(value = "file", required = false) MultipartFile file) {

        Long id = cvDataService.saveCvData(payload, file);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/documents/{id}")
                .buildAndExpand(id)
                .toUri();

        return ResponseEntity.created(location).build();
    }

}
