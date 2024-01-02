// RelationRepository.java
package com.LAT.backend.repository;

import com.LAT.backend.model.Relation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RelationRepository extends JpaRepository<Relation, Integer> {
    List<Relation> findByMainLawClassId(Integer mainLawClassId);
}
