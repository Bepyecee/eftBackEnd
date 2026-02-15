package com.example.investmenttracker.service;

import com.example.investmenttracker.model.User;
import com.example.investmenttracker.exception.ValidationException;
import com.example.investmenttracker.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findOrCreateUser(String email, String provider, String name) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setProvider(provider);
                    newUser.setName(name != null ? name : email);
                    return userRepository.save(newUser);
                });
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("user.not.found", email));
    }

    public User getUserInfo(String email) {
        return userRepository.findByEmail(email)
                .orElse(null);
    }
}
