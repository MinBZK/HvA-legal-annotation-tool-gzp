package com.LAT.backend.app;

import org.slf4j.Logger;
import com.LAT.backend.model.ApplicationProperty;
import com.LAT.backend.repository.ApplicationPropertyRepository;
import com.LAT.backend.repository.ProjectRepository;
import com.LAT.backend.rest.ProjectController;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
public class ProjectControllerTest {
    private static final Logger log = LoggerFactory.getLogger(ProjectControllerTest.class);

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectRepository projectRepository;

    @MockBean
    private ApplicationPropertyRepository applicationPropertyRepository;

    @Test
    void getProjectCountsShouldReturnCurrentAndMaxCounts() throws Exception {
        // Arrange
        int maxXmlFiles = 40;
        long currentProjectCount = 42; // Simulate that the current count of XML files exceeds the maximum

        when(projectRepository.countProjects()).thenReturn(currentProjectCount);
        when(applicationPropertyRepository.findByPropertyName("max_xml_files"))
                .thenReturn(Optional.of(new ApplicationProperty("max_xml_files", maxXmlFiles)));

        // Log the counts
        if (currentProjectCount >= maxXmlFiles) {
            log.info("The current project count of {} has reached or exceeded the maximum allowed XML files of {}.", currentProjectCount, maxXmlFiles);
        }

        // Act & Assert
        mockMvc.perform(get("/api/projectCounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentCount").value(currentProjectCount))
                .andExpect(jsonPath("$.maxCount").value(maxXmlFiles));
    }
}
