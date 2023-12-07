package com.LAT.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String xml_content;

    private String selectedArticles;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Annotation> annotations;

    public List<Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<Annotation> annotations) {
        this.annotations = annotations;
    }

    public Long getId() {
        return id;
    }

    public String getXml_content() {
        return xml_content;
    }

    public void setXml_content(String xml_content) {
        this.xml_content = xml_content;
    }

    public String getSelectedArticles() {
        return selectedArticles;
    }

    public void setSelectedArticles(String selectedArticles) {
        this.selectedArticles = selectedArticles;
    }
}
