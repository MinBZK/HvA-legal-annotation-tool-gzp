package com.LAT.backend.model;

import com.LAT.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;

@Entity
public class User {

    public enum Role {Admin, Jurist, User};

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.Basic.class)
    private Long id;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @JsonView(Views.Basic.class)
    private Role role;
    @Column(nullable = false)
    @JsonView(Views.Basic.class)
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
