package com.LAT.backend.repository;

import com.LAT.backend.model.Annotation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



public interface AnnotationRepository extends CrudRepository<Annotation, Integer> {
}
