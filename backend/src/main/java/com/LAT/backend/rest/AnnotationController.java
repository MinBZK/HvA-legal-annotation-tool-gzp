package com.LAT.backend.rest;

import java.util.List;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.repository.AnnotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class AnnotationController {
    
    @Autowired
    private AnnotationRepository annotationRepository;

    @GetMapping("/annotations")
     public Iterable<Annotation> getAllAnnotations() {
        return annotationRepository.findAll();
    }

    @PostMapping("/saveAnnotation")
    public ResponseEntity<String> addAnnotation(@RequestBody Annotation annotation) {
        try {
            annotationRepository.save(annotation);
            return new ResponseEntity<>("Annotation saved successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("Error saving annotations");
            return new ResponseEntity<>("Error saving annotation", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteAnnotation/{id}")
    public ResponseEntity<String> deleteAnnotation(@PathVariable Integer id) {
        try {
            annotationRepository.deleteById(id);
            return new ResponseEntity<>("Annotation deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error deleting annotation: " + e.getMessage());
            return new ResponseEntity<>("Error deleting annotation", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateAnnotation/{id}")
    public ResponseEntity<String> updateAnnotation(@PathVariable Integer id, @RequestBody Annotation updatedAnnotation) {
        return annotationRepository.findById(id)
                .map(annotation -> {
                    annotation.setText(updatedAnnotation.getText());
                    annotationRepository.save(annotation);
                    return new ResponseEntity<>("Annotation updated successfully", HttpStatus.OK);
                }).orElseGet(() -> new ResponseEntity<>("Annotation not found", HttpStatus.NOT_FOUND));
    }




}
