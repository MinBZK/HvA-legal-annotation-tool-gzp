package com.LAT.backend.repository;

import com.LAT.backend.model.Annotation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnotationRepository extends CrudRepository<Annotation, Integer> {
    List<Annotation> findByProjectId(Integer projectId);

    List<Annotation> findByParentAnnotation(Annotation parentAnnotation);

    @Query("SELECT a FROM Annotation a WHERE a.parentAnnotation.id = :parentId")
    List<Annotation> getAnnotationsFromParentIdJPQL(Integer parentId);

    List<Annotation> findByParentAnnotationId(Integer parentId);

}
