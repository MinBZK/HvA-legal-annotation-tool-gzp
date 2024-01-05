package com.LAT.backend.repository;

import com.LAT.backend.model.ApplicationProperty;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository("applicationPropertyRepository")
public interface ApplicationPropertyRepository extends CrudRepository<ApplicationProperty, Long> {
    Optional<ApplicationProperty> findByPropertyName(String propertyName);
}
