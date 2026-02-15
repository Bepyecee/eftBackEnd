package com.example.investmenttracker.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Profile("dev")
public class DevUserDetailsService implements UserDetailsService {

    @Value("${app.auth.dev.username}")
    private String devUsername;

    @Value("${app.auth.dev.password}")
    private String devPassword;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (devUsername.equals(username)) {
            return new User(devUsername, devPassword, new ArrayList<>());
        }
        throw new UsernameNotFoundException("user.not.found: " + username);
    }
}
