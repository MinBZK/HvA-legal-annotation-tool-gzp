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

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/terms/{reference}")
    public ResponseEntity<List<Term>> getTermsByReference(@PathVariable String reference) {
        List<Term> terms = termRepository.findByReference(reference);
        return ResponseEntity.ok(terms);
    }

    @PostMapping("/saveTerm")
    public ResponseEntity<Term> addTerm(@RequestBody Term term) {
        Term savedTerm = termRepository.save(term);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTerm);
    }

}
