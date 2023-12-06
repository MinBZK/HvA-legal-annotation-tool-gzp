package com.LAT.backend.repository;
import org.springframework.data.repository.CrudRepository;
import com.LAT.backend.model.Class;

import java.util.Optional;

public interface ClassRepository extends CrudRepository<Class, Integer> {
    Optional<Class> findByName(String name);
}
