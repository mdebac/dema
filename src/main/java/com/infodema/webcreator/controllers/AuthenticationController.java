package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.auth.AuthenticationRequest;
import com.infodema.webcreator.domain.auth.AuthenticationResponse;
import com.infodema.webcreator.domain.auth.RegistrationRequest;
import com.infodema.webcreator.domain.utility.UtilityHelper;
import com.infodema.webcreator.services.AuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request,
            @RequestHeader("Host") String host
    ) throws MessagingException {
        host = UtilityHelper.resolveHostForDevelopment(host);
        request.setHost(host);
        service.register(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            @RequestHeader("Host") String host
    ) {
        host = UtilityHelper.resolveHostForDevelopment(host);
        request.setHost(host);
        return ResponseEntity.ok(service.authenticate(request));
    }
    @GetMapping("/activate-account")
    public void confirm(
            @RequestParam String token
    ) throws MessagingException {
        service.activateAccount(token);
    }


}
