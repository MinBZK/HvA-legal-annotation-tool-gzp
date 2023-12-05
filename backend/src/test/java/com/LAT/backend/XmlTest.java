//package com.LAT.backend;
//
//import com.LAT.backend.model.Project;
//import com.LAT.backend.repository.XmlRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
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
//public class XmlTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private XmlRepository xmlRepository;
//
//    @Test
//    public void testSaveXmlFile() throws Exception {
//        Project project = new Project();
//        project.setId(1L);
//        project.setXmlLocation("/path/to/xml/file.xml");
//        project.setSelectedArticles(List.of("Article1", "Article2"));
//
//        ObjectMapper objectMapper = new ObjectMapper();
//        String xml = objectMapper.writeValueAsString(project);
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/saveXml")
//                .content(xml)
//                .contentType(MediaType.APPLICATION_XML))
//                .andExpect(MockMvcResultMatchers.status().isCreated());
//
//        List<Project> projects = xmlRepository.findAll();
//        assertEquals(1, projects.size());
//        assertEquals(1L, projects.get(0).getId());
//        assertEquals("/path/to/xml/file.xml", projects.get(0).getXmlLocation());
//        assertEquals(List.of("Article1", "Article2"), projects.get(0).getSelectedArticles());
//    }
//}
