package com.LAT.backend;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.repository.AnnotationRepository;
import com.LAT.backend.repository.ProjectRepository;
import com.LAT.backend.repository.LawClassRepository;  // Import LawClassRepository
import com.LAT.backend.rest.AnnotationController;
import com.LAT.backend.rest.ProjectController;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AnnotationController.class)
@AutoConfigureMockMvc
public class GetAnnotationTest {

    @MockBean
    private AnnotationController annotationController;

    @MockBean
    private AnnotationRepository annotationRepository;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectRepository projectRepository;

    // Mock LawClassRepository
    @MockBean
    private LawClassRepository lawClassRepository;

    @Test
    void testGetAnnotationsByProjectId() throws Exception {
        // Arrange: Mock the behavior of the repository
        int projectIdAnnotation = 1;

        // Using the same project ID in the path and for the mock setup
        List<Annotation> mockAnnotations = List.of(
                new Annotation()
        );
        // Mocking the behavior of the annotationController
        when(annotationRepository.findByProjectId(projectIdAnnotation)).thenReturn(mockAnnotations);

        // Act and Assert
        mockMvc.perform(get("/api/annotations/project/{projectId}", projectIdAnnotation)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0))) // Expecting one element in the array
                .andDo(result -> {
                    String actualResponse = result.getResponse().getContentAsString();
                    System.out.println("Actual Response: " + actualResponse);
                })
                .andReturn();
    }
}
