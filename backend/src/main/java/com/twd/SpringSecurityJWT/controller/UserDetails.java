package com.twd.SpringSecurityJWT.controller;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class UserDetails {
    private String username;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetails(String username, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.authorities = authorities;
    }

    public String getUsername() {
        return username;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
}
