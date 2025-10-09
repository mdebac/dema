package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.core.Menu;
import com.infodema.webcreator.services.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class MenuController {

    private final MenuService menuService;

  /*  @PostMapping("/menus")
    public ResponseEntity<Menu> add(
            @Valid @RequestBody Menu menu) {



        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(model.getId())
                .toUri();
        return ResponseEntity.created(location).body(model);
    }


    @DeleteMapping("/{mainId}/menus/{id}")
    public ResponseEntity<Void> remove(@PathVariable("mainId") Long mainId, @PathVariable("id") Long id) {
        menuService.removeMenu(mainId, id);
        return ResponseEntity.noContent().build();
    }
    */
    @PutMapping("/menu/{id}")
    public ResponseEntity<Menu> update(
            @PathVariable("id") Long id,
            @Valid @RequestBody Menu menu) {

        Menu model = menuService.updateMenu(id, menu);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(model.getId())
                .toUri();
        return ResponseEntity.created(location).body(model);

    }

}

