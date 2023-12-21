package com.LAT.backend.rest;

import com.LAT.backend.exceptions.LawClassNotFoundException;
import com.LAT.backend.exceptions.ProjectNotFoundException;
import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Project;
import com.LAT.backend.model.Term;
import com.LAT.backend.repository.AnnotationRepository;
import com.LAT.backend.repository.LawClassRepository;
import com.LAT.backend.repository.ProjectRepository;
import com.LAT.backend.repository.TermRepository;
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

    @Autowired
    private TermRepository termRepository;

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
    public ResponseEntity<Annotation> createAnnotation(@RequestBody Annotation annotation) {
        int index = 0;
//        try {
            // Validate if the project exists
            Project project = projectRepository.findById(annotation.getProject().getId())
                    .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

            // Validate if the annotation class exists
            LawClass lawClass = lawClassRepository.findByName(annotation.getLawClass().getName())
                    .orElseThrow(() -> new LawClassNotFoundException("Annotation class not found"));

            Term term = annotation.getTerm();
            term.setReference(annotation.getSelectedWord());

            termRepository.save(term);

            annotation.setProject(project);
            annotation.setLawClass(lawClass);
            annotation.setTerm(term);

            // Save the annotation to the repository
            Annotation savedAnnotation = annotationRepository.save(annotation);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAnnotation);
//        } catch (ProjectNotFoundException | LawClassNotFoundException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
//        }
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

        if (annotationDetails.getTerm() != null && annotationDetails.getTerm().getId() != null) {
            Term termDetails = annotationDetails.getTerm();
            Term term = termRepository.findById(termDetails.getId())
                    .orElse(null);  // Create a new Term if it doesn't exist

            if (term == null) {
                term = new Term();
            }

            term.setReference(termDetails.getReference());
            term.setDefinition(termDetails.getDefinition());

            // Save the term to the database
            term = termRepository.save(term);

            // Set the term to the annotation
            annotation.setTerm(term);
        }

        return annotationRepository.save(annotation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAnnotationById(@PathVariable Integer id) {
        try {
            Optional<Annotation> annotation = annotationRepository.findById(id);
            return ResponseEntity.ok(annotation);
        } catch (Exception e) {
            // Log the exception for debugging
            System.out.println("Error fetching annotation: " + e.getMessage());
            // Return an error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching annotation");
        }
    }
}