package com.LAT.backend.rest;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.Class;
import com.LAT.backend.model.AnnotationHasClass;
import com.LAT.backend.repository.AnnotationRepository;
import com.LAT.backend.repository.ClassRepository;
import com.LAT.backend.repository.AnnotationHasClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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

    @Autowired
    private AnnotationHasClassRepository annotationHasClassRepository;

    @Autowired
    private ClassRepository classRepository;

    @PostMapping("/save-annotation")
    public ResponseEntity<String> saveAnnotationWithClasses(@RequestBody Annotation annotation) {
        try {
            List<Class> classes = StreamSupport
                    .stream(classRepository.findAllById(annotation.getClasses().stream().map(Class::getId).collect(Collectors.toList())).spliterator(), false)
                    .collect(Collectors.toList());
            annotation.setClasses(classes);

            annotationRepository.save(annotation);

            return new ResponseEntity<>("Annotation saved successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error saving annotation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
