package com.LAT.backend.rest;

import com.LAT.backend.model.LawClass;
import com.LAT.backend.repository.LawClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class LawClassController {

    @Autowired
    private LawClassRepository lawClassRepository;

    @GetMapping("/classes")
    public Iterable<LawClass> getAllAnnotations() {
        return lawClassRepository.findAll();
    }

}
