package com.LAT.backend.model;

import jakarta.persistence.*;

@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String xml_location;

    private String selectedArticles;

    public Long getId() {
        return id;
    }

    public String getXml_location() {
        return xml_location;
    }

    public void setXml_location(String xml_location) {
        this.xml_location = xml_location;
    }
}
