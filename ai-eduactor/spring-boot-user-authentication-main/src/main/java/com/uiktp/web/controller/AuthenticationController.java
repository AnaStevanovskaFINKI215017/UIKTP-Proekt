package com.uiktp.web.controller;

import com.uiktp.model.dtos.AuthenticationDTO;
import com.uiktp.model.dtos.RegisterDTO;
import com.uiktp.model.User;
import com.uiktp.model.exceptions.general.InvalidArgumentsException;
import com.uiktp.config.security.TokenService;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping( "/auth")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    public AuthenticationController(AuthenticationManager authenticationManager, TokenService tokenService, AuthenticationService authenticationService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.authenticationService = authenticationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO data, HttpServletResponse response) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(data.email());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User with the provided email does not exist.");
            }

            var authenticationToken = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var authentication = authenticationManager.authenticate(authenticationToken);

            var user = (User) authentication.getPrincipal();
            var token = tokenService.generateToken(user);
            Cookie jwtCookie = new Cookie("jwt", token);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setPath("/");
            response.addCookie(jwtCookie);

            return ResponseEntity.ok().body(Map.of("token", token, "email", user.getEmail(), "name", user.getName(), "id", user.getId().toString()));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect password. Please try again.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred. Please try again later.");
        }
    }

    
    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    tokenService.invalidateToken(token);

                    Cookie jwtCookie = new Cookie("jwt", null);
                    jwtCookie.setHttpOnly(true);
                    jwtCookie.setPath("/");
                    jwtCookie.setMaxAge(0);
                    response.addCookie(jwtCookie);
                }
            }
        }

        return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody RegisterDTO registerDTO) {
        try {
            authenticationService.register(registerDTO);
            return ResponseEntity.ok().body("User registered successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already taken.");
        } catch (InvalidArgumentsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input data.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

}
