package com.uiktp.controllers;

import com.uiktp.entities.users.dtos.AuthenticationDTO;
import com.uiktp.entities.users.dtos.RegisterDTO;
import com.uiktp.entities.users.User;
import com.uiktp.security.TokenService;
import com.uiktp.repositories.UserRepository;
import com.uiktp.services.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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
    private AuthenticationService authService;

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
//    public String login(AuthenticationDTO data, RedirectAttributes redirectAttributes) {
//        var authenticationToken = new UsernamePasswordAuthenticationToken(data.email(), data.password());
//        var authentication = authenticationManager.authenticate(authenticationToken);
//
//        var user = (User) authentication.getPrincipal();
//        var token = tokenService.generateToken(user);
//
//        redirectAttributes.addFlashAttribute("token", token);
//        return "redirect:/auth/home";
//    }

    @PostMapping("/login")
    public String login(@ModelAttribute AuthenticationDTO data, HttpServletResponse response) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var authentication = authenticationManager.authenticate(authenticationToken);

        var user = (User) authentication.getPrincipal();
        var token = tokenService.generateToken(user);

        Cookie jwtCookie = new Cookie("jwt", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);
        return "redirect:/auth/home";
    }
    @PostMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        // Retrieve the token from cookies
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    // Optionally blacklist the token
                    tokenService.invalidateToken(token);

                    // Clear the cookie
                    Cookie jwtCookie = new Cookie("jwt", null);
                    jwtCookie.setHttpOnly(true);
                    jwtCookie.setPath("/");
                    jwtCookie.setMaxAge(0); // Expire immediately
                    response.addCookie(jwtCookie);
                }
            }
        }

        // Redirect to login page after logout
        return "redirect:/auth/login?logout=true";
    }
    @GetMapping("/register")
    public String showRegisterPage() {
        return "register";
    }

    @PostMapping("/register")
    public String processRegister(RegisterDTO data) {
        if (this.userRepository.findByEmail(data.email()) != null) {
            return "redirect:/auth/register?error=Email already exists";
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User user = new User(data.name(), data.email(), encryptedPassword, data.role());

        this.userRepository.save(user);

        return "redirect:/auth/login";
    }
}
