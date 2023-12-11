package com.LAT.backend;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Project;
import com.LAT.backend.repository.AnnotationRepository;
import com.LAT.backend.repository.LawClassRepository;
import com.LAT.backend.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
public class AnnotationTest {

    @Autowired
    private AnnotationRepository annotationRepository;

    @Autowired
    private LawClassRepository lawClassRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testSaveAndGetAnnotation() {
        LawClass lawClass = new LawClass();
        lawClass.setName("ExampleLawClass");
        lawClassRepository.save(lawClass);

        Project project = new Project();
        project.setXml_content("test");
        projectRepository.save(project);

        Annotation annotation = new Annotation();
        annotation.setSelectedWord("ExampleWord");
        annotation.setText("ExampleText");
        annotation.setLawClass(lawClass);
        annotation.setProject(project);

        // Save the Annotation to the repository
        annotationRepository.save(annotation);

        // Retrieve the Annotation from the repository
        Optional<Annotation> retrievedAnnotation = annotationRepository.findById(annotation.getId());

        // Assertions
        assertNotNull(retrievedAnnotation.orElse(null));
        assertEquals("ExampleWord", retrievedAnnotation.map(Annotation::getSelectedWord).orElse(null));
        assertEquals("ExampleText", retrievedAnnotation.map(Annotation::getText).orElse(null));
        assertEquals(lawClass, retrievedAnnotation.map(Annotation::getLawClass).orElse(null));
        assertEquals(project, retrievedAnnotation.map(Annotation::getProject).orElse(null));

        // Cross-check results - Additional assertions
        Annotation crossCheckedAnnotation = retrievedAnnotation.orElseThrow();
        assertEquals(annotation.getId(), crossCheckedAnnotation.getId());
        assertEquals(annotation.getSelectedWord(), crossCheckedAnnotation.getSelectedWord());
        assertEquals(annotation.getText(), crossCheckedAnnotation.getText());
        assertEquals(annotation.getLawClass(), crossCheckedAnnotation.getLawClass());
        assertEquals(annotation.getProject(), crossCheckedAnnotation.getProject());
    }

    @Test
    void testCreateAnnotationMissingLawClassId() throws Exception {
        ProjectRepository mockProjectRepository = Mockito.mock(ProjectRepository.class);

        // Arrange
        long projectId = 1L;
        when(mockProjectRepository.findById(projectId)).thenReturn(Optional.of(new Project()));

        Annotation annotation = new Annotation();
        annotation.setSelectedWord("ExampleWord");
        annotation.setText("ExampleText");
        annotation.setProject(new Project()); // A valid project with an ID

        // Act and Assert
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/project")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(annotation)))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void testCreateAnnotationMissingProjectId() throws Exception {
        LawClassRepository mockLawClassRepository = Mockito.mock(LawClassRepository.class);

        // Arrange
        String lawClassName = "ExampleLawClass";
        when(mockLawClassRepository.findByName(lawClassName)).thenReturn(Optional.of(new LawClass()));

        Annotation annotation = new Annotation();
        annotation.setSelectedWord("ExampleWord");
        annotation.setText("ExampleText");
        annotation.setLawClass(new LawClass()); // A valid law class with a name

        // Act and Assert
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/project")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(annotation)))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}
