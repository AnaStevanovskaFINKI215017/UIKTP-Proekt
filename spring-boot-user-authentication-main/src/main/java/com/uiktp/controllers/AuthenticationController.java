package com.uiktp.controllers;

import com.uiktp.entities.users.dtos.AuthenticationDTO;
import com.uiktp.entities.users.dtos.RegisterDTO;
import com.uiktp.entities.users.User;
import com.uiktp.exceptions.InvalidArgumentsException;
import com.uiktp.security.TokenService;
import com.uiktp.repositories.UserRepository;
import com.uiktp.services.Implementation.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
@RequestMapping( "/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private AuthenticationService authenticationService;

    @GetMapping("/home")
    public String homePage(Model model, HttpServletRequest request) {
        String token = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if (token != null) {
            String userEmail = tokenService.validateToken(token);
            if (userEmail != null) {
                model.addAttribute("userEmail", userEmail);
            }
        }
        return "home";
    }

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

//    @PostMapping("/login")
//    public String login(@ModelAttribute AuthenticationDTO data, HttpServletResponse response) {
//        var authenticationToken = new UsernamePasswordAuthenticationToken(data.email(), data.password());
//        var authentication = authenticationManager.authenticate(authenticationToken);
//
//        var user = (User) authentication.getPrincipal();
//        var token = tokenService.generateToken(user);
//
//        Cookie jwtCookie = new Cookie("jwt", token);
//        jwtCookie.setHttpOnly(true);
//        jwtCookie.setPath("/");
//        response.addCookie(jwtCookie);
//        return "redirect:/auth/home";
//    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody AuthenticationDTO data, HttpServletResponse response) {
//        try {
//            var authenticationToken = new UsernamePasswordAuthenticationToken(data.email(), data.password());
//            var authentication = authenticationManager.authenticate(authenticationToken);
//
//            var user = (User) authentication.getPrincipal();
//            var token = tokenService.generateToken(user);
//
//            Cookie jwtCookie = new Cookie("jwt", token);
//            jwtCookie.setHttpOnly(true);
//            jwtCookie.setPath("/");
//            response.addCookie(jwtCookie);
//
//            return ResponseEntity.ok().body(Map.of("token", token));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
//        }
//    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO data, HttpServletResponse response) {
        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var authentication = authenticationManager.authenticate(authenticationToken);

            var user = (User) authentication.getPrincipal();
            var token = tokenService.generateToken(user);

            Cookie jwtCookie = new Cookie("jwt", token);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setPath("/");
            response.addCookie(jwtCookie);

            // Return both token and email
            return ResponseEntity.ok().body(Map.of("token", token, "email", user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }
    }


    @PostMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
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
        return "redirect:/auth/login?logout=true";
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
