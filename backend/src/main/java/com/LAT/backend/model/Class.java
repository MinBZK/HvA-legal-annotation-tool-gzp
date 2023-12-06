package com.LAT.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    private String color;

    @OneToMany(mappedBy="annotationClass")
    private List<Annotation> annotations;

    @OneToMany(mappedBy = "mainClass")
    private List<Relation> mainClasses;

    @OneToMany(mappedBy = "subClass")
    private List<Relation> subClasses;

    public List<Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<Annotation> annotations) {
        this.annotations = annotations;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
