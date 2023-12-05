package com.LAT.backend.rest;

import com.LAT.backend.model.AnnotationHasClass;
import com.LAT.backend.model.Class;
import com.LAT.backend.repository.AnnotationHasClassRepository;
import com.LAT.backend.repository.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class AnnotationHasClassController {

    @Autowired
    private AnnotationHasClassRepository annotationHasClassRepository;

    @GetMapping("/annotationswithclasses")
    public Iterable<AnnotationHasClass> getAllAnnotationWithClass() {
        return annotationHasClassRepository.findAll();
    }
}
