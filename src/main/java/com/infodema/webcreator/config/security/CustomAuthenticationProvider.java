package com.infodema.webcreator.config.security;

import com.infodema.webcreator.persistance.entities.security.User;
import com.infodema.webcreator.persistance.repositories.security.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        CustomAuthentication customAuthentication = (CustomAuthentication) authentication;
        String email = customAuthentication.getEmail();
        String host = customAuthentication.getHost();

        User user = repository.findByEmailAndHost(email, host).orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        System.out.println("Email: " + user.getEmail());
//        System.out.println("Host: " + user.getHost());
//        System.out.println("customAuthentication.getPassword(): " + customAuthentication.getPassword());
//        System.out.println("user.getPassword(): " + user.getPassword());

        if(!customAuthentication.isAuthenticated()){
            if(this.passwordEncoder.matches(customAuthentication.getPassword(), user.getPassword())){
                return new CustomAuthentication(true, null, null, null, user);
            }else{
                throw new BadCredentialsException("Bad credentials");
            }
        }
        return new CustomAuthentication(true, null, null, null, user);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return CustomAuthentication.class.isAssignableFrom(authentication);
    }

}
