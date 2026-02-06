package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.core.Header;
import com.infodema.webcreator.domain.core.Panel;
import com.infodema.webcreator.domain.enums.Chip;
import com.infodema.webcreator.domain.utility.UtilityHelper;
import com.infodema.webcreator.services.MainService;
import com.infodema.webcreator.services.PanelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class MenuSideController {

    private final PanelService panelService;
    private final MainService mainService;

    @PreAuthorize("hasAuthority('ADMIN') || hasAuthority('MANAGER')")
    @PutMapping("/move-side-menu")
    public ResponseEntity<Header> moveSideMenu(
            @RequestHeader("Host") String host,
            @RequestPart(value = "panel") Panel panel) {

        if(panel.getChip() == Chip.MOVE_LEFT) {
            panelService.moveSideMenuUp(panel);
        }

        if(panel.getChip() == Chip.MOVE_RIGHT) {
            panelService.moveSideMenuDown(panel);
        }

        Header header = mainService.findHeaderByHost(UtilityHelper.resolveHostForDevelopment(host));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/panel")
                .buildAndExpand(panel.getId())
                .toUri();
        return ResponseEntity.created(location).body(header);

    }

}

