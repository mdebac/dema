package com.infodema.webcreator.config.security;

import com.infodema.webcreator.domain.utility.UtilityHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
   private final CustomAuthenticationManager customAuthenticationManager;
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String host = request.getHeader("Host");
        host = UtilityHelper.resolveHostForDevelopment(host);

        if (request.getServletPath().contains("/api/v1/auth")
                || request.getServletPath().contains("/api/v1/find")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            if (jwtService.isTokenValid(jwt)) {
                CustomAuthentication customAuthentication = new CustomAuthentication(true, userEmail, host, null ,null);
                Authentication authToken = customAuthenticationManager.authenticate(customAuthentication);
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }else{
                //System.out.println("Token not valid------------------------");
            }
        }

        filterChain.doFilter(request, response);
    }
}
