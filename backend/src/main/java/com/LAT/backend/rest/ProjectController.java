package com.LAT.backend.rest;

import com.LAT.backend.exceptions.ProjectNotFoundException;
import com.LAT.backend.model.Project;
import com.LAT.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/projects")
    public Iterable<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("project/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        return ResponseEntity.ok(project);
    }

    @PostMapping("/saveXml")
    public ResponseEntity<String> addProject(@RequestBody Project project) {
        projectRepository.save(project);
        return new ResponseEntity<>("Project saved successfully", HttpStatus.CREATED);
    }
}

