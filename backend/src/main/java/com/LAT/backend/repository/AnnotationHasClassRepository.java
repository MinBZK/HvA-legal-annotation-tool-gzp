package com.LAT.backend.repository;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.AnnotationHasClass;
import org.springframework.data.repository.CrudRepository;

public interface AnnotationHasClassRepository extends CrudRepository<Annotation, Integer> {
    static void save(AnnotationHasClass annotationHasClass) {

    }
}
