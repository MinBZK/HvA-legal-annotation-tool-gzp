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
    
//    @PostMapping("/saveAnnotation")
//    public ResponseEntity<String> addAnnotation(@RequestBody Annotation annotation) {
//        annotationRepository.save(annotation);
//        return new ResponseEntity<>("Annotation saved successfully", HttpStatus.CREATED);
//    }

    @Autowired
    private AnnotationHasClassRepository annotationHasClassRepository;

    @Autowired
    private ClassRepository classRepository;

    @PostMapping("/save-annotation")
    public ResponseEntity<Annotation> saveAnnotationWithClass(@RequestBody AnnotationHasClass annotationHasClass) {
        // Assuming you have the Class details in the request body
        Class aClass = annotationHasClass.getaClass();

        // Save the class (assuming class name is unique)
        Class savedClass = classRepository.findByName(aClass.getName())
                .orElseGet(() -> classRepository.save(aClass));

        // Set the saved class
        annotationHasClass.setaClass(savedClass);

        // Save the association in the join table
        AnnotationHasClassRepository.save(annotationHasClass);

        // Optionally, return the saved annotation
        return new ResponseEntity<>(annotationHasClass.getAnnotation(), HttpStatus.CREATED);
    }
}
