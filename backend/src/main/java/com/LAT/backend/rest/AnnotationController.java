package com.LAT.backend.rest;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Project;
import com.LAT.backend.repository.AnnotationRepository;
import com.LAT.backend.repository.LawClassRepository;
import com.LAT.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

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
    @PostMapping("/project")
    public Annotation createAnnotation(@RequestBody Annotation annotation) {
        // Validate if the project exists
        Project project = projectRepository.findByProjectId(annotation.getProject().getId())
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
}
