package com.LAT.backend.rest;

import com.LAT.backend.model.Project;
import com.LAT.backend.repository.XmlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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

    @GetMapping("/project/{projectId}")
    public Optional<Project> getProjectById(@PathVariable Long projectId) {
        return xmlRepository.findById(projectId);
    }

    @PostMapping("/saveXml")
    public ResponseEntity<String> addProject(@RequestBody Project project) {
        xmlRepository.save(project);
        return new ResponseEntity<>("Project saved successfully", HttpStatus.CREATED);
    }
}
