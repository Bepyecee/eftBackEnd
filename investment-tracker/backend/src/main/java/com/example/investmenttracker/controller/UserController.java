package com.example.investmenttracker.controller;

import com.example.investmenttracker.model.User;
import com.example.investmenttracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserInfo(email);

        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("provider", user.getProvider());
        } else {
            response.put("email", email);
            response.put("name", email);
            response.put("provider", "local");
        }

        return ResponseEntity.ok(response);
    }
}
