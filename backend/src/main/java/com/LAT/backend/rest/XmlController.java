package com.LAT.backend.rest;

import com.LAT.backend.model.Project;
import com.LAT.backend.repository.XmlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class XmlController {

    @Autowired
    private XmlRepository xmlRepository;

    @GetMapping("/projects")
    public Iterable<Project> getAllProjects() {
        return xmlRepository.findAll();
    }

    @PostMapping("/saveXml")
    public ResponseEntity<String> addProject(@RequestBody Project project) {
        xmlRepository.save(project);
        return new ResponseEntity<>("Project saved successfully", HttpStatus.CREATED);
    }
}

