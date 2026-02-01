package com.smartinventory.inventory_service.controller;

import com.smartinventory.inventory_service.model.User;
import com.smartinventory.inventory_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.smartinventory.inventory_service.config.JwtUtils jwtUtils;

    @PostConstruct
    public void seedUsers() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            System.out.println("Seeded Admin User");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("ROLE_USER"); // Default role

        user.setName(payload.get("name"));
        user.setEmail(payload.get("email"));
        user.setMobile(payload.get("mobile"));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("authenticated", false, "message", "Not Authenticated"));
        }
        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "username", authentication.getName(),
                "authorities", authentication.getAuthorities()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtils.generateToken(user.getUsername());
                return ResponseEntity.ok(Map.of(
                        "username", user.getUsername(),
                        "role", user.getRole(),
                        "token", token,
                        "message", "Login Successful"));
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }

    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, String> payload,
            java.security.Principal principal) {
        // Only the hardcoded 'admin' user can create other managers
        if (principal == null || !principal.getName().equals("admin")) {
            return ResponseEntity.status(403).body(Map.of("error", "Only Root Admin can create additional Managers"));
        }

        String username = payload.get("username");
        String password = payload.get("password");
        String role = payload.getOrDefault("role", "ROLE_CO_ADMIN"); // Default to Co-Admin

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role.startsWith("ROLE_") ? role : "ROLE_" + role);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Manager registered successfully as " + role));
    }
}
