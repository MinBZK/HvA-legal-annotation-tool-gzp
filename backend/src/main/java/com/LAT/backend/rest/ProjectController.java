package com.LAT.backend.rest;

import com.LAT.backend.exceptions.ProjectNotFoundException;
import com.LAT.backend.model.ApplicationProperty;
import com.LAT.backend.model.Project;
import com.LAT.backend.repository.ApplicationPropertyRepository;
import com.LAT.backend.repository.ProjectRepository;
import com.LAT.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ApplicationPropertyRepository applicationPropertyRepository;

    @GetMapping("/projects")
    @JsonView(Views.Basic.class)
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

    @GetMapping("/maxXmlCount")
    public ResponseEntity<Integer> getMaxXmlCount() {
        int maxXmlCount = applicationPropertyRepository.findByPropertyName("max_xml_files")
                .map(ApplicationProperty::getPropertyValue)
                .orElse(40); // Standaardwaarde als de eigenschap niet gevonden wordt

        return ResponseEntity.ok(maxXmlCount);
    }

    @GetMapping("/projectCounts")
    public ResponseEntity<Map<String, Long>> getProjectCounts() {
        long currentProjectCount = projectRepository.countProjects();
        int maxXmlCount = applicationPropertyRepository.findByPropertyName("max_xml_files")
                .map(ApplicationProperty::getPropertyValue)
                .orElse(40);

        Map<String, Long> counts = new HashMap<>();
        counts.put("currentCount", currentProjectCount);
        counts.put("maxCount", (long) maxXmlCount);

        return ResponseEntity.ok(counts);
    }

}

