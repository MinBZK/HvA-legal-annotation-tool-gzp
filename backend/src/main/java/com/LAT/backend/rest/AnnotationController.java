package com.LAT.backend.rest;

import com.LAT.backend.exceptions.LawClassNotFoundException;
import com.LAT.backend.exceptions.UserNotFoundException;
import com.LAT.backend.model.*;
import com.LAT.backend.repository.*;
import com.LAT.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonView;
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
    private LawClassRepository lawClassRepository;

    @Autowired
    private TermRepository termRepository;

    @Autowired
    private RelationRepository relationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    @JsonView(Views.Extended.class)
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

    // Endpoint to create a new annotation for a specific project
    // Hanna
    @PostMapping("/")
    public ResponseEntity<Annotation> createAnnotation(@RequestBody Annotation annotation) {
//        try {

        // Validate if the annotation class exists
        LawClass lawClass = lawClassRepository.findByName(annotation.getLawClass().getName())
                .orElseThrow(() -> new LawClassNotFoundException("Annotation class not found"));

        // Validate if the annotation user exists
        User user = userRepository.findById(annotation.getCreated_by().getId())
                        .orElseThrow(() -> new UserNotFoundException("User annotation not found!"));

        if (annotation.getRelation() != null) {
            int relationId = annotation.getRelation().getId();
            Relation relation = relationRepository.findById(relationId)
                    .orElseThrow(() -> new EntityNotFoundException("Parent annotation not found with id: " + relationId));
            annotation.setRelation(relation);
        }

        Term term = annotation.getTerm();

            if (term != null) {
                if (term.getDefinition() != null) {
                    Term savedTerm = termRepository.save(term);
                    annotation.setTerm(savedTerm);
                } else {
                    annotation.setTerm(null);
                }
            }

            annotation.setLawClass(lawClass);
            annotation.setCreated_by(user);

        // Handle the parent annotation if it's passed
        if (annotation.getParentAnnotation() != null) {
            int parentAnnotationId = annotation.getParentAnnotation().getId();
            Annotation parentAnnotation = annotationRepository.findById(parentAnnotationId)
                    .orElseThrow(() -> new EntityNotFoundException("Parent annotation not found with id: " + parentAnnotationId));
            annotation.setParentAnnotation(parentAnnotation);
        }

        // Save the annotation to the repository
        Annotation savedAnnotation = annotationRepository.save(annotation);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAnnotation);
    }

    @GetMapping("/sub/{parentId}")
    public ResponseEntity<List<Annotation>> getSubAnnotationsByParentId(@PathVariable Integer parentId) {
        Optional<Annotation> parentAnnotation = annotationRepository.findById(parentId);
        if (!parentAnnotation.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<Annotation> subAnnotations = annotationRepository.findByParentAnnotation(parentAnnotation.get());
        return ResponseEntity.ok(subAnnotations);
    }



    @DeleteMapping("/deleteannotation/{id}")
    public ResponseEntity<String> deleteAnnotationAndChildren(@PathVariable Integer id) {
        try {
            Optional<Annotation> annotationOptional = annotationRepository.findById(id);
            if (annotationOptional.isPresent()) {
                // Delete child annotations with the same parent ID
                deleteChildAnnotations(id);

                // Delete the parent annotation
                annotationRepository.deleteById(id);

                return new ResponseEntity<>("Annotation and its children deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Annotation not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            System.out.println("Error deleting annotation and its children: " + e.getMessage());
            return new ResponseEntity<>("Error deleting annotation and its children", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void deleteChildAnnotations(Integer parentId) {
        List<Annotation> childAnnotations = annotationRepository.findByParentAnnotationId(parentId);

        if (childAnnotations != null && !childAnnotations.isEmpty()) {
            for (Annotation child : childAnnotations) {
                // Recursively delete child annotations
                deleteChildAnnotations(child.getId());
                annotationRepository.deleteById(child.getId());
            }
        }
    }
//    public ResponseEntity<String> deleteAnnotation(@PathVariable Integer id) {
//        try {
//            annotationRepository.deleteById(id);
//            return new ResponseEntity<>("Annotation deleted successfully", HttpStatus.OK);
//        } catch (Exception e) {
//            System.out.println("Error deleting annotation: " + e.getMessage());
//            return new ResponseEntity<>("Error deleting annotation", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @PutMapping("/updateannotation/{id}")
    public Annotation updateAnnotation(@PathVariable Integer id, @RequestBody Annotation annotationDetails) {
        Annotation annotation = annotationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Annotation does not exist with id: " + id));

        annotation.setText(annotationDetails.getText());
        annotation.setSelectedWord(annotationDetails.getSelectedWord());
        annotation.setLawClass(annotationDetails.getLawClass());
        annotation.setUpdated_at(annotationDetails.getUpdated_at());
        annotation.setUpdated_by(annotationDetails.getUpdated_by());

        Term term = annotationDetails.getTerm();

        if (term != null) {
            Term existingTerm = termRepository.findById(term.getId())
                .orElse(null);

            if (existingTerm != null) {
               annotation.setTerm(existingTerm);
            } else if (!term.getDefinition().isEmpty()) {
                Term savedTerm = termRepository.save(term);
                annotation.setTerm(savedTerm);
            }

        } else {
            annotation.setTerm(null);
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

    @GetMapping("/children/{id}")
    public Iterable<Annotation> getChildAnnotationsOfParentById(@PathVariable Integer id) {
        return annotationRepository.getAnnotationsFromParentIdJPQL(id);
    }
}
