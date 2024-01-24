package com.LAT.backend.app;

import com.LAT.backend.model.*;
import com.LAT.backend.repository.*;
import com.LAT.backend.rest.AnnotationController;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Test;
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

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AnnotationRepository annotationRepository;

    @MockBean
    private LawClassRepository lawClassRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private TermRepository termRepository;

    @MockBean
    private RelationRepository relationRepository;

    @Autowired
    private AnnotationController annotationController;

    @Test
    void createAnnotationWithAllValues() {
        // Arrange
        Annotation requestAnnotation = new Annotation();
        LawClass mockLawClass = new LawClass();
        mockLawClass.setName("ExampleLawClass");
        requestAnnotation.setLawClass(mockLawClass);

        User mockUser = new User();
        mockUser.setId(1L);
        requestAnnotation.setCreated_by(mockUser);

        Annotation parentAnnotation = new Annotation();
        parentAnnotation.setId(2);
        requestAnnotation.setParentAnnotation(parentAnnotation);

        // Mock relation (without saving)
        Relation mockRelation = new Relation();
        mockRelation.setId(3);
        mockRelation.setMainLawClass(mockLawClass);
        mockRelation.setSubLawClass(mockLawClass); // Assuming the same law class for simplicity
        mockRelation.setCardinality(Relation.Cardinality.V_1);
        mockRelation.setDescription("Example Relation");

        // Mock term (without saving)
        Term mockTerm = new Term();
        mockTerm.setId(4L);
        mockTerm.setReference("Example Reference");
        mockTerm.setDefinition("Example Definition");

        requestAnnotation.setRelation(mockRelation);
        requestAnnotation.setTerm(mockTerm);

        // Mock repository behaviors
        when(lawClassRepository.findByName(any())).thenReturn(Optional.of(mockLawClass));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(mockUser));
        when(annotationRepository.save(any())).thenReturn(requestAnnotation);
        when(annotationRepository.findById(anyInt())).thenReturn(Optional.of(parentAnnotation));
        when(relationRepository.findById(anyInt())).thenReturn(Optional.of(mockRelation));
        when(termRepository.save(any())).thenReturn(mockTerm);

        // Act
        ResponseEntity<Annotation> response = annotationController.createAnnotation(requestAnnotation);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(requestAnnotation, response.getBody());

        // Verify interactions (no saving verifications)
        verify(lawClassRepository, times(1)).findByName(any());
        verify(userRepository, times(1)).findById(anyLong());
        verify(annotationRepository, times(1)).save(any());
        verify(annotationRepository, times(1)).findById(anyInt());
        verify(relationRepository, times(1)).findById(anyInt());
        verify(termRepository, times(1)).save(any());
    }

    @Test
    public void createAnnotationWithMandatoryValues() throws Exception {
        // Arrange: Mock objects
        LawClass mockLawClass = new LawClass();
        mockLawClass.setId(1);
        mockLawClass.setName("Rechtsbetrekking");
        mockLawClass.setColor("#70a4ff");

        User mockUser = new User();
        mockUser.setId(1L);

        Annotation mockAnnotation = new Annotation();
        mockAnnotation.setId(1);
        mockAnnotation.setSelectedWord("ExampleWord");
        mockAnnotation.setText("ExampleText");
        mockAnnotation.setCreated_at(24012023L);

        // Mock repository interactions
        when(lawClassRepository.findByName(any())).thenReturn(Optional.of(mockLawClass));
        when(userRepository.findById(any())).thenReturn(Optional.of(mockUser));
        when(annotationRepository.save(any(Annotation.class))).thenReturn(mockAnnotation);

        // Request annotation object
        Annotation requestAnnotation = new Annotation();
        // Set properties for the request annotation
        requestAnnotation.setLawClass(mockLawClass);
        requestAnnotation.setCreated_by(mockUser);
        requestAnnotation.setCreated_at(24012023L);

        // Act: Perform the request using mockMvc
        ResultActions result = mockMvc.perform(post("/api/annotations/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestAnnotation)));

        // Assert
        result.andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.selectedWord").value("ExampleWord"))
                .andExpect(jsonPath("$.text").value("ExampleText"));

        // Verify that the save method was called on the annotationRepository
        verify(annotationRepository, times(1)).save(any(Annotation.class));
    }

    @Test
    public void createAnnotationWithInvalidLawClass() throws Exception {
        // Mock objects
        User mockUser = new User();
        mockUser.setId(1L);

        Annotation requestAnnotation = new Annotation();
        requestAnnotation.setLawClass(new LawClass());  // Set lawClass to null
        requestAnnotation.setCreated_by(mockUser);
        requestAnnotation.setCreated_at(24012023L);

        // Perform the request using mockMvc
        try {
            mockMvc.perform(post("/api/annotations/")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestAnnotation)));

            // If no exception is thrown, fail the test
            fail("Expected LawClassNotFoundException, but no exception was thrown.");
        } catch (ServletException ex) {

            // Check the exception message
            assertEquals(ex.getCause().getMessage(), "Law class not found");
        }
    }

    @Test
    public void createAnnotationWithInvalidUser() throws Exception {
        // Mock objects
        User mockUser = new User();

        LawClass mockLawClass = new LawClass();
        mockLawClass.setId(1);
        mockLawClass.setName("Rechtsbetrekking");
        mockLawClass.setColor("#70a4ff");

        Annotation mockAnnotation = new Annotation();
        mockAnnotation.setLawClass(mockLawClass);  // Set lawClass to null
        mockAnnotation.setCreated_by(mockUser);
        mockAnnotation.setCreated_at(24012023L);

        // Mock repository interactions
        when(lawClassRepository.findByName(any())).thenReturn(Optional.of(mockLawClass));
        when(annotationRepository.save(any(Annotation.class))).thenReturn(mockAnnotation);

        // Request annotation object
        Annotation requestAnnotation = new Annotation();
        // Set properties for the request annotation
        requestAnnotation.setLawClass(mockLawClass);
        requestAnnotation.setCreated_by(mockUser);
        requestAnnotation.setCreated_at(24012023L);

        // Perform the request using mockMvc
        try {
            mockMvc.perform(post("/api/annotations/")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestAnnotation)));

            // If no exception is thrown, fail the test
            fail("Expected EntityNotFound exception, but no exception was thrown.");
        } catch (ServletException ex) {
            // Check the exception message
            assertEquals(ex.getCause().getMessage(), "User annotation not found!");
        }
    }

    @Test
    public void createAnnotationWithNullCreatedByUser() throws Exception {
        // Mock objects
        LawClass mockLawClass = new LawClass();
        mockLawClass.setId(1);
        mockLawClass.setName("Rechtsbetrekking");
        mockLawClass.setColor("#70a4ff");

        Annotation requestAnnotation = new Annotation();
        requestAnnotation.setLawClass(mockLawClass);
        requestAnnotation.setCreated_by(null);  // Set created_by to null
        requestAnnotation.setCreated_at(24012023L);

        // Mock repository interactions
        when(lawClassRepository.findByName(any())).thenReturn(Optional.of(mockLawClass));

        // Perform the request using mockMvc
        try {
            mockMvc.perform(post("/api/annotations/")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestAnnotation)));

            // If no exception is thrown, fail the test
            fail("Expected LawClassNotFoundException, but no exception was thrown.");
        } catch (ServletException ex) {
            // Check the exception message
            assertEquals(ex.getCause().getMessage(), "Cannot invoke \"com.LAT.backend.model.User.getId()\" because the return value of \"com.LAT.backend.model.Annotation.getCreated_by()\" is null");
        }
    }
}
