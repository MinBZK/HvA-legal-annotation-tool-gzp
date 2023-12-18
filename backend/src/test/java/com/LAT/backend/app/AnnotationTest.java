package com.LAT.backend.app;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Project;
import com.LAT.backend.repository.AnnotationRepository;
import com.LAT.backend.repository.LawClassRepository;
import com.LAT.backend.repository.ProjectRepository;
import com.LAT.backend.rest.AnnotationController;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnnotationController.class)
@AutoConfigureMockMvc
public class AnnotationTest {

    @MockBean
    private AnnotationRepository annotationRepository;

    @MockBean
    private LawClassRepository lawClassRepository;

    @MockBean
    private ProjectRepository projectRepository;

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private ObjectMapper objectMapper;

    @InjectMocks
    private AnnotationController annotationController;

//    @Test
//    public void testCreateAnnotation() throws Exception {
//        // Mock objects
//        Project mockProject = new Project();
//        mockProject.setId(1L);
//
//        LawClass mockLawClass = new LawClass();
//        mockLawClass.setName("ExampleLawClass");
//
//        Annotation mockAnnotation = new Annotation();
//        mockAnnotation.setId(1);
//        mockAnnotation.setSelectedWord("ExampleWord");
//        mockAnnotation.setText("ExampleText");
//
//        // Mock repository interactions
//        when(projectRepository.findById(anyLong())).thenReturn(Optional.of(mockProject));
//        when(lawClassRepository.findByName(anyString())).thenReturn(Optional.of(mockLawClass));
//        when(annotationRepository.save(any(Annotation.class))).thenReturn(mockAnnotation);
//
//        // Request annotation object
//        Annotation requestAnnotation = new Annotation();
//        // Set properties for the request annotation
//        requestAnnotation.setLawClass(mockLawClass);
//        requestAnnotation.setProject(mockProject);
//
//        // Perform the request using mockMvc
//        ResultActions result = mockMvc.perform(post("/api/annotations/project")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(requestAnnotation)));
//
//        // Assertions
//        result.andExpect(status().isCreated())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(jsonPath("$.selectedWord").value("ExampleWord"))
//                .andExpect(jsonPath("$.text").value("ExampleText"));
//
//        // Verify repository interactions
//        verify(projectRepository, times(1)).findById(anyLong());
//        verify(lawClassRepository, times(1)).findByName(anyString());
//        verify(annotationRepository, times(1)).save(any(Annotation.class));
//    }

    @Test
    void testCreateAnnotationMissingLawClassId() throws Exception {
        // Arrange
        long projectId = 1L;
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(new Project()));

        Annotation annotation = new Annotation();
        annotation.setSelectedWord("ExampleWord");
        annotation.setText("ExampleText");
        Project project = new Project();
        project.setXml_content("lorem ipsum");
        annotation.setProject(project); // A valid project with an ID

        // Act and Assert
        mockMvc.perform(post("/api/annotations/project")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(annotation)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateAnnotationWithProjectNotFound() throws Exception {
        // Arrange
        Annotation annotation = new Annotation();
        annotation.setSelectedWord("ExampleWord");
        annotation.setText("ExampleText");
        annotation.setProject(new Project());

        // Mock the projectRepository to return an empty Optional, simulating "Project not found"
        when(projectRepository.findById(any(Long.class))).thenReturn(Optional.empty());

        // Act and Assert
        mockMvc.perform(post("/api/annotations/project")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(annotation)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateAnnotationWithNullValues() {
        // Test with null annotation
        ResponseEntity<Annotation> response = annotationController.createAnnotation(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        // Test with annotation having null project and law class
        Annotation annotation = new Annotation();
        annotation.setId(1);
        annotation.setText("ExampleText");
        ResponseEntity<Annotation> response2 = annotationController.createAnnotation(annotation);
        assertEquals(HttpStatus.BAD_REQUEST, response2.getStatusCode());
        assertNull(response2.getBody());
    }
}
