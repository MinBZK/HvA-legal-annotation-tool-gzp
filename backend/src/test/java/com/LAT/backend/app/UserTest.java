package com.LAT.backend.app;

import com.LAT.backend.model.User;
import com.LAT.backend.repository.UserRepository;
import com.LAT.backend.rest.UserController;
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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserTest {

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private UserController userController;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetAllUsers() throws Exception {
        User user1 = new User();
        user1.setId(1L);
        user1.setName("User");
        user1.setRole(User.Role.User);
        User user2 = new User();
        user2.setId(1L);
        user2.setName("Admin");
        user2.setRole(User.Role.Admin);

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/api/users")
                .contentType(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[0].id").value(1))
                .andExpect(jsonPath("$.[0].name").value("User"))
                .andExpect(jsonPath("$.[0].role").value("User"))
                .andExpect(jsonPath("$.[1].id").value(1))
                .andExpect(jsonPath("$.[1].name").value("Admin"))
                .andExpect(jsonPath("$.[1].role").value("Admin"));

    }
    @Test
    void testGetUserById() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setName("User");
        user.setRole(User.Role.User);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/api/users/{projectId}", 1L)
                .contentType(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("User"))
                .andExpect(jsonPath("$.role").value("User"));

    }
}
