//package com.LAT.backend.app;
//
//import com.LAT.backend.exceptions.ProjectNotFoundException;
//import com.LAT.backend.model.Project;
//import com.LAT.backend.repository.ProjectRepository;
//import com.LAT.backend.rest.ProjectController;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.ResultActions;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//
//import java.util.Arrays;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.assertThrows;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(ProjectController.class)
//public class ProjectTest {
//
//    @MockBean
//    private ProjectRepository projectRepository;
//
//    @InjectMocks
//    private ProjectController projectController;
//
//    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Test
//    void testGetAllProjects() throws Exception {
//        // Arrange
//        Project project1 = new Project();
//        project1.setId(1L);
//        project1.setXml_content("Project 1");
//        project1.setSelectedArticles("Article 1, Article 2"); // Set selectedArticles
//
//        Project project2 = new Project();
//        project2.setId(2L);
//        project2.setXml_content("Project 2");
//        project2.setSelectedArticles("Article 3, Article 4"); // Set selectedArticles
//
//        when(projectRepository.findAll()).thenReturn(Arrays.asList(project1, project2));
//
//        // Act
//        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/api/projects")
//                .contentType(MediaType.APPLICATION_JSON));
//
//        // Assert
//        result.andExpect(status().isOk())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(jsonPath("$.[0].id").value(1))
//                .andExpect(jsonPath("$.[0].xml_content").value("Project 1"))
//                .andExpect(jsonPath("$.[0].selectedArticles").value("Article 1, Article 2"))
//                .andExpect(jsonPath("$.[1].id").value(2))
//                .andExpect(jsonPath("$.[1].xml_content").value("Project 2"))
//                .andExpect(jsonPath("$.[1].selectedArticles").value("Article 3, Article 4"));
//    }
//
//    @Test
//    void testGetProjectById() throws Exception {
//        // Arrange
//        Project project = new Project();
//        project.setId(1L);
//        project.setXml_content("Project 1");
//        project.setSelectedArticles("Article 1, Article 2");
//
//        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
//
//        // Act
//        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/api/project/{projectId}", 1L)
//                .contentType(MediaType.APPLICATION_JSON));
//
//        // Assert
//        result.andExpect(status().isOk())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.xml_content").value("Project 1"))
//                .andExpect(jsonPath("$.selectedArticles").value("Article 1, Article 2"));
//    }
//
//    @Test
//    void testProjectControllerShouldThrowNotFoundException() {
//        long nonExistentProjectId = 999L;
//        when(projectRepository.findById(nonExistentProjectId)).thenReturn(Optional.empty());
//
//        assertThrows(ProjectNotFoundException.class, () -> projectController.getProjectById(nonExistentProjectId));
//    }
//}
