package com.LAT.backend.repository;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.Class;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



public interface ClassRepository extends CrudRepository<Class, Integer> {
}
