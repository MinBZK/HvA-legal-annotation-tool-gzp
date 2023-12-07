//package com.LAT.backend;
//
//import com.LAT.backend.repository.AnnotationRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//public class AnnotationTest {
//
//    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private AnnotationRepository annotationRepository;
//
//    @Test
//    public void createAnnotation() throws Exception {
//        String json = "{\"annotationText\":\"Test Annotation\"}";
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/saveAnnotation")
//                .content(json)
//                .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.annotationText").value("Test Annotation"));
//    }
//}
