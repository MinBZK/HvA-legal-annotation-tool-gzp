package com.LAT.backend.rest;

import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Project;
import com.LAT.backend.model.Term;
import com.LAT.backend.repository.LawClassRepository;
import com.LAT.backend.repository.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class TermController {

    @Autowired
    private TermRepository termRepository;

    @GetMapping("/terms")
    public Iterable<Term> getAllDefinitions() {
        return termRepository.findAll();
    }

    @PostMapping("/saveTerm")
    public ResponseEntity<Term> addTerm(@RequestBody Term term) {
        Term savedTerm = termRepository.save(term);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTerm);
    }

}
