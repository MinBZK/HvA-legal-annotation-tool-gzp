package com.LAT.backend.repository;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Project;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository("projectRepository")
public interface ProjectRepository extends CrudRepository<Project, Long> {

    @Query("SELECT COUNT(p) FROM Project p")
    long countProjects();
}
