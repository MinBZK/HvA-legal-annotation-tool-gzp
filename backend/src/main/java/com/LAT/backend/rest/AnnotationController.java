package com.LAT.backend.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class AnnotationController {
    
    @Autowired
    private AnnotationRepository annotationRepository;

    @GetMapping("/annotations")
     public List<Annotation> getAllAnnotations() {
        return annotationRepository.findAll();
    }
    
    @PostMapping("/saveAnnotation")
    public ResponseEntity<String> addAnnotation(@RequestBody Annotation annotation) {
        return annotationRepository.save(annotation);
    }
}