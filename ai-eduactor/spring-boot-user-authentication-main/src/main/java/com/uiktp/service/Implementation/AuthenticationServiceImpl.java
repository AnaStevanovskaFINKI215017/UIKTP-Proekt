package com.uiktp.service.Implementation;

import com.uiktp.model.User;
import com.uiktp.model.UserRole;
import com.uiktp.model.dtos.RegisterDTO;
import com.uiktp.model.exceptions.InvalidArgumentsException;
import com.uiktp.model.exceptions.*;
import com.uiktp.repository.UserRepository;
import com.uiktp.config.security.TokenService;
import com.uiktp.service.Interface.AuthenticationService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    public AuthenticationServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User login(String email) {
        if (email == null || email.isEmpty()) {
            throw new InvalidArgumentsException();
        }
        return userRepository.findByEmail(email).orElseThrow(InvalidUserCredentialsException::new);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional
    @Override
    public User register(RegisterDTO registerDTO) {
        if (registerDTO.getEmail() == null || registerDTO.getEmail().isEmpty() || registerDTO.getPassword() == null || registerDTO.getPassword().isEmpty() || registerDTO.getName() == null || registerDTO.getName().isEmpty()) {
            throw new InvalidArgumentsException("Invalid input data");
        }
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already taken.");
        }

        String encodedPassword = new BCryptPasswordEncoder().encode(registerDTO.getPassword());
        User newUser = new User();
        newUser.setName(registerDTO.getName());
        newUser.setEmail(registerDTO.getEmail());
        newUser.setPassword(encodedPassword);
        newUser.setIndex("213089");
        newUser.setRole(UserRole.USER);
        return userRepository.save(newUser);
    }

}
