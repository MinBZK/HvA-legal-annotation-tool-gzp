package com.LAT.backend.repository;

import com.LAT.backend.model.ApplicationProperty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationPropertyRepository extends JpaRepository<ApplicationProperty, Long> {
    Optional<ApplicationProperty> findByPropertyName(String propertyName);
}
