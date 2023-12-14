package com.LAT.backend.rest;

import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Term;
import com.LAT.backend.repository.LawClassRepository;
import com.LAT.backend.repository.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class TermController {

    @Autowired
    private TermRepository termRepository;

    @GetMapping("/classes")
    public Iterable<Term> getAllAnnotations() {
        return termRepository.findAll();
    }

}
