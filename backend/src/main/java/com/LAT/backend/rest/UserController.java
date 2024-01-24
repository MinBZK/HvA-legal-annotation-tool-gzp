package com.LAT.backend.rest;

import com.LAT.backend.exceptions.ProjectNotFoundException;
import com.LAT.backend.model.User;
import com.LAT.backend.repository.UserRepository;
import com.LAT.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("")
    @JsonView(Views.Basic.class)
    public ResponseEntity<List<User>> getAllRoles() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    @JsonView(Views.Basic.class)
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ProjectNotFoundException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/roles")
    @JsonView(Views.Basic.class)
    public ResponseEntity<User.Role[]> getRoles() {
        User.Role[] roles = User.Role.values();
        return ResponseEntity.ok(roles);
    }

    @PostMapping("")
    public ResponseEntity<String> addUser(@RequestBody User user) {
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User saved successfully");
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
