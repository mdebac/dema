package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.core.Header;
import com.infodema.webcreator.domain.core.Menu;
import com.infodema.webcreator.domain.core.Panel;
import com.infodema.webcreator.domain.enums.Chip;
import com.infodema.webcreator.domain.utility.UtilityHelper;
import com.infodema.webcreator.services.MainService;
import com.infodema.webcreator.services.MenuService;
import com.infodema.webcreator.services.PanelService;
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
public class MenuController {

    private final MenuService menuService;
    private final PanelService panelService;
    private final MainService mainService;

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @PutMapping("/menu/{id}")
    public ResponseEntity<Menu> update(
            @PathVariable("id") Long id,
            @RequestPart(value = "menu") Menu menu,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        Menu model = menuService.updateMenu(id, menu, file);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(model.getId())
                .toUri();
        return ResponseEntity.created(location).body(model);

    }


    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @PutMapping("/menu")
    public ResponseEntity<Header> moveTopMenu(
            @RequestHeader("Host") String host,
            @RequestPart(value = "menu") Menu menu) {

        if(menu.getChip() == Chip.MOVE_LEFT) {
           menuService.moveTopMenuLeft(menu);
        }

        if(menu.getChip() == Chip.MOVE_RIGHT) {
            menuService.moveTopMenuRight(menu);
        }

        Header header = mainService.findHeaderByHost(UtilityHelper.resolveHostForDevelopment(host));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/menu")
                .buildAndExpand(menu.getId())
                .toUri();
        return ResponseEntity.created(location).body(header);

    }
}

