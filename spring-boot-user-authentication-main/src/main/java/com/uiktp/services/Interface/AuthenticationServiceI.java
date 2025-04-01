package com.uiktp.services.Interface;

import com.uiktp.entities.users.User;
import com.uiktp.entities.users.dtos.RegisterDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface AuthenticationServiceI extends UserDetailsService {
    User login(String email);

    User register(RegisterDTO registerDTO);
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;
}
