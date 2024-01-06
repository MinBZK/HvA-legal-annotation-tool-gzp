package com.LAT.backend.rest;

import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Relation;
import com.LAT.backend.repository.LawClassRepository;
import com.LAT.backend.service.RelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class LawClassController {

    @Autowired
    private LawClassRepository lawClassRepository;


    @Autowired
    private RelationService relationService;

    @GetMapping("/classes")
    public Iterable<LawClass> getAllAnnotations() {
        return lawClassRepository.findAll();
    }

    @GetMapping("/relations/{lawClassId}")
    public ResponseEntity<List<Relation>> getRelationsByLawClass(@PathVariable Integer lawClassId) {
        List<Relation> relations = relationService.findRelationsByMainLawClass(lawClassId);
        return ResponseEntity.ok(relations);
    }

    @GetMapping("/lawclasses/{id}")
    public ResponseEntity<LawClass> getLawClassById(@PathVariable Integer id) {
        Optional<LawClass> lawClass = lawClassRepository.findById(id);
        if (lawClass.isPresent()) {
            return ResponseEntity.ok(lawClass.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
