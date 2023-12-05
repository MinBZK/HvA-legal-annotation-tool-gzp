package com.LAT.backend.repository;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.Project;
import org.springframework.data.repository.CrudRepository;

public interface XmlRepository extends CrudRepository<Project, Long> {
}
