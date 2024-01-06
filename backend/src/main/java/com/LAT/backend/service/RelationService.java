package com.LAT.backend.service;

import com.LAT.backend.model.Relation;
import com.LAT.backend.repository.RelationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RelationService {

    private final RelationRepository relationRepository;

    @Autowired
    public RelationService(RelationRepository relationRepository) {
        this.relationRepository = relationRepository;
    }

    public List<Relation> findRelationsByMainLawClass(Integer lawClassId) {
        return relationRepository.findByMainLawClassId(lawClassId);
    }
}
