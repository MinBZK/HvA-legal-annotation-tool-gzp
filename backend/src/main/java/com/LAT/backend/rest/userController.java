package com.LAT.backend.rest;

import com.LAT.backend.exceptions.ProjectNotFoundException;
import com.LAT.backend.model.User;
import com.LAT.backend.repository.UserRepository;
import com.LAT.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class userController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("")
    @JsonView(Views.Basic.class)
    public Iterable<User> getAllRoles() {
        return userRepository.findAll();
    }

    @GetMapping("/{userId}")
    @JsonView(Views.Basic.class)
    public ResponseEntity<User> getAllRoles(@PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ProjectNotFoundException("User not found"));

        return ResponseEntity.ok(user);
    }

    @GetMapping("/roles")
    @JsonView(Views.Basic.class)
    public User.Role[] getRoles() {
        return User.Role.values();
    }
}
