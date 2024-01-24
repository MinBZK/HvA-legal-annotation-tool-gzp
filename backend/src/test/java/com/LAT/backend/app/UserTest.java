package com.LAT.backend.app;

import com.LAT.backend.model.User;
import com.LAT.backend.repository.UserRepository;
import com.LAT.backend.rest.UserController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserTest {

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private UserController userController;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void initTest() throws Exception {
        // Create two user instances for testing
        User user1 = new User();
        user1.setId(1L);
        user1.setName("User");
        user1.setRole(User.Role.User);

        User user2 = new User();
        user2.setId(1L);
        user2.setName("Admin");
        user2.setRole(User.Role.Admin);

        // Mock the behavior of userRepository.findAll() to return a list containing the two user instances
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        // Mock the behavior of userRepository.findById(1L) to return user1 when called with ID 1
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        // Mock the behavior of userRepository.deleteById(1L) to do nothing when called with ID 1
        // This is used to simulate the deletion of a user without affecting the actual repository
        doNothing().when(userRepository).deleteById(1L);
    }

    @Test
    void testGetAllUsers() throws Exception {
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/api/users").contentType(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[0].id").value(1))
                .andExpect(jsonPath("$.[0].name").value("User"))
                .andExpect(jsonPath("$.[0].role").value("User"))
                .andExpect(jsonPath("$.[1].id").value(1))
                .andExpect(jsonPath("$.[1].name").value("Admin"))
                .andExpect(jsonPath("$.[1].role").value("Admin"));
    }

    @Test
    void testGetUserById() throws Exception {
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/api/users/{projectId}", 1L).contentType(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("User"))
                .andExpect(jsonPath("$.role").value("User"));
    }

    @Test
    void testDeleteUserById() throws Exception {
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/{projectId}", 1L).contentType(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk());

        verify(userRepository, times(1)).deleteById(1L);
    }
}
