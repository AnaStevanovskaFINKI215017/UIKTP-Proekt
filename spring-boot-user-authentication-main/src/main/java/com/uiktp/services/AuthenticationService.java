package com.uiktp.services;

import com.uiktp.entities.users.User;
import com.uiktp.exceptions.InvalidArgumentsException;
import com.uiktp.exceptions.*;
import com.uiktp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public  class AuthenticationService implements AuthenticationServiceI {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User login(String email) {
        if (email == null || email.isEmpty()) {
            throw new InvalidArgumentsException();
        }
        return userRepository.findByEmail(email).orElseThrow(InvalidUserCredentialsException::new);
    }
    //    @Override
    //    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    //        return userRepository.findByEmail(email);
    //    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
