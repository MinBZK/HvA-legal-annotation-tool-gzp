package com.LAT.backend.rest;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.Project;
import com.LAT.backend.repository.AnnotationRepository;
import com.LAT.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/annotations")
public class AnnotationController {
    
    @Autowired
    private AnnotationRepository annotationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/annotations")
    public Iterable<Annotation> getAllAnnotations() {
        return annotationRepository.findAll();
    }

    // Endpoint to get all annotations for a specific project
    @GetMapping("/project/{projectId}")
    public Optional<Annotation> getAnnotationsByProjectId(@PathVariable Integer projectId) {
        // Implement logic to retrieve annotations by project ID from the repository
        return annotationRepository.findById(projectId);
    }

    // Endpoint to create a new annotation for a specific project
    @PostMapping("/project/{projectId}")
    public Annotation createAnnotation(@PathVariable Long projectId, @RequestBody Annotation annotation) {
        // Validate if the project exists
        Project project = projectRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Set the project for the annotation
        annotation.setProject(project);

        // Save the annotation to the repository
        return annotationRepository.save(annotation);

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
