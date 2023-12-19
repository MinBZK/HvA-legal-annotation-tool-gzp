package com.LAT.backend.repository;
import org.springframework.data.repository.CrudRepository;
import com.LAT.backend.model.LawClass;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LawClassRepository extends CrudRepository<LawClass, Integer> {
    Optional<LawClass> findByName(String name);
}
