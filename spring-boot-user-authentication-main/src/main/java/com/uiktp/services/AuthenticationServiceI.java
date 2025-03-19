package com.uiktp.services;

import com.uiktp.entities.users.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface AuthenticationServiceI extends UserDetailsService {
    User login(String email);
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;
}
