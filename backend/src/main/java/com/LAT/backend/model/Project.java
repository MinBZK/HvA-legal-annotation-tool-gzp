package com.LAT.backend.model;

import com.LAT.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.Basic.class)
    private Long id;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    @JsonView(Views.Extended.class)
    private String xml_content;

    @Column(nullable = false)
    @JsonView(Views.Basic.class)
    private String title;

    private String selectedArticles;
    @JsonView(Views.Extended.class)
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Annotation> annotations;

    public List<Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<Annotation> annotations) {
        this.annotations = annotations;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project project)) return false;
        return Objects.equals(getId(), project.getId());
    }
}
