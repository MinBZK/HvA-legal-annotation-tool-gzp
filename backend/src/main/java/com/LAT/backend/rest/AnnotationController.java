package com.LAT.backend.rest;

import com.LAT.backend.model.Project;
import com.LAT.backend.repository.AnnotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnnotationController {

    @GetMapping("/api/annotations")
    public ResponseEntity<String> getAnnotations() {
        // Your logic to retrieve data
        return ResponseEntity.ok("Data from Spring Boot");
    }
}
