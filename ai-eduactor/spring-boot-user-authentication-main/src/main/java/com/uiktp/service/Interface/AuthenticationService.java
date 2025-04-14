package com.uiktp.service.Interface;

import com.uiktp.model.User;
import com.uiktp.model.dtos.RegisterDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface AuthenticationService extends UserDetailsService {
    User login(String email);

    User register(RegisterDTO registerDTO);
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;
}
