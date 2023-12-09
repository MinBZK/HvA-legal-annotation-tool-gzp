package com.LAT.backend.rest;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Project;
import com.LAT.backend.repository.AnnotationRepository;
import com.LAT.backend.repository.LawClassRepository;
import com.LAT.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.persistence.EntityNotFoundException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/annotations")
public class AnnotationController {
    
    @Autowired
    private AnnotationRepository annotationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private LawClassRepository lawClassRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAllAnnotations() {
        try {
            Iterable<Annotation> annotations = annotationRepository.findAll();
            return ResponseEntity.ok(annotations);
        } catch (Exception e) {
            // Log the exception for debugging
            System.out.println("Error fetching annotations: " + e.getMessage());
            // Return an error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching annotations");
        }
    }
    // Endpoint to get all annotations for a specific project
    // Chi Yu
    @GetMapping("/project/{projectId}")
    public List<Annotation> getAnnotationsByProjectId(@PathVariable Integer projectId) {
        return annotationRepository.findByProjectId(projectId);
    }

    // Endpoint to create a new annotation for a specific project
    // Hanna
    @PostMapping("/project")
    public Annotation createAnnotation(@RequestBody Annotation annotation) {
        // Validate if the project exists
        Project project = projectRepository.findById(annotation.getProject().getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Validate if the annotation class exists
        LawClass lawClass = lawClassRepository.findByName(annotation.getLawClass().getName())
                .orElseThrow(() -> new RuntimeException("Annotation class not found"));

        // Set the project for the annotation
        annotation.setProject(project);

        // Set the annotation class for the annotation
        annotation.setLawClass(lawClass);

        // Save the annotation to the repository
        return annotationRepository.save(annotation);
    }

    @DeleteMapping("/deleteannotation/{id}")
    public ResponseEntity<String> deleteAnnotation(@PathVariable Integer id) {
        try {
            annotationRepository.deleteById(id);
            return new ResponseEntity<>("Annotation deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error deleting annotation: " + e.getMessage());
            return new ResponseEntity<>("Error deleting annotation", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateannotation/{id}")
    public Annotation updateAnnotation(@PathVariable Integer id, @RequestBody Annotation annotationDetails) {
        Annotation annotation = annotationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Annotation does not exist with id: " + id));

        annotation.setText(annotationDetails.getText());
        annotation.setSelectedWord(annotationDetails.getSelectedWord());
        annotation.setLawClass(annotationDetails.getLawClass());
        annotation.setProject(annotationDetails.getProject());


        return annotationRepository.save(annotation);
    }




}
