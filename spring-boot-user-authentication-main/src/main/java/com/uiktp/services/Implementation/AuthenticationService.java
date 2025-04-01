package com.uiktp.services.Implementation;

import com.uiktp.entities.users.User;
import com.uiktp.entities.users.UserRole;
import com.uiktp.entities.users.dtos.RegisterDTO;
import com.uiktp.exceptions.InvalidArgumentsException;
import com.uiktp.exceptions.*;
import com.uiktp.repositories.UserRepository;
import com.uiktp.security.TokenService;
import com.uiktp.services.Interface.AuthenticationServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements AuthenticationServiceI {

    @Autowired
    private UserRepository userRepository;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

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

    @Override
    public User register(RegisterDTO registerDTO) {
        if (registerDTO.getEmail() == null || registerDTO.getEmail().isEmpty() || registerDTO.getPassword() == null || registerDTO.getPassword().isEmpty() || registerDTO.getName() == null || registerDTO.getName().isEmpty()) {
            throw new InvalidArgumentsException("Invalid input data");
        }
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already taken.");
        }


        User newUser = new User();
        newUser.setName(registerDTO.getName());
        newUser.setEmail(registerDTO.getEmail());
        newUser.setPassword(registerDTO.getPassword());
        newUser.setIndex("213089");
        newUser.setRole(UserRole.USER);
        return userRepository.save(newUser);
    }

}
