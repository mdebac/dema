package com.infodema.webcreator.domain.utility;

import lombok.experimental.UtilityClass;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@UtilityClass
public class SecurityUtils {

    public static final String ANONYMOUS_USER = "ANONYMOUS";

    /**
     * The authenticated user ID (TODO impersonation)
     */
    public static String getUserName() {
        if(SecurityContextHolder.getContext().getAuthentication().isAuthenticated()){
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } else{
            return ANONYMOUS_USER;
        }
    }

    public static List<String> getUserRoles() {
        if(SecurityContextHolder.getContext().getAuthentication().isAuthenticated()){
            return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                    .stream().                    map(GrantedAuthority::getAuthority)
                    .toList();
        }
        else {
            return List.of();
        }
    }

    /*
     * The impersonated user ID if impersonation is active.
     * Otherwise, this is the authenticated user ID
     * <a href="https://www.youtube.com/watch?v=l5Za_WrPL_4">...</a>
     */
    /*public static String getUserId() {
        return Optional.ofNullable(AccessTokenFilter.ACCESS_TOKEN.get())
                .map(AccessToken::getImpersonatingUserDetails)
                .map(AccessToken.UserDetails::getUserId)
                .orElse(getAuthenticatedUserId());
    }*/

}
