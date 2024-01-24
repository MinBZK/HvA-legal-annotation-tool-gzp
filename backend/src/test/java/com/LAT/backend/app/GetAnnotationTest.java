package com.LAT.backend.app;

import com.LAT.backend.model.Annotation;
import com.LAT.backend.model.LawClass;
import com.LAT.backend.model.Term;
import com.LAT.backend.repository.*;
import com.LAT.backend.rest.AnnotationController;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnnotationController.class)
@AutoConfigureMockMvc
public class GetAnnotationTest {

    @MockBean
    private AnnotationRepository annotationRepository;

    // Mocking LawClassRepository
    @MockBean
    private LawClassRepository lawClassRepository;

    @MockBean
    private TermRepository termRepository;

    // Mocking RelationRepository
    @MockBean
    private RelationRepository relationRepository;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private MockMvc mockMvc;

    // Chi Yu
    @Test
    void testGetAnnotationById() throws Exception {
        // Arrange: Mock the behavior of the repository

        Integer annotationId = 1;

        // Create an annotation
        Annotation mock = new Annotation();
        mock.setId(annotationId);
        mock.setText("annotation");

        mock.setCreated_at(123L);
        mock.setUpdated_at(456L);

        Optional<Annotation> mockAnnotation = Optional.of(mock);

        // Mocking
        when(annotationRepository.findById(annotationId)).thenReturn(mockAnnotation);

        // Act and Assert
        mockMvc.perform(get("/api/annotations/{id}", annotationId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(annotationId))) // Expecting an object with ID matching the request
                .andExpect(jsonPath("$.text", is("annotation")))
                .andExpect(jsonPath("$.created_at", is(123)))
                .andExpect(jsonPath("$.updated_at", is(456)))
                .andDo(result -> {
                    String actualResponse = result.getResponse().getContentAsString();
                    System.out.println("Actual Response: " + actualResponse);
                })
                .andReturn();
    }
}