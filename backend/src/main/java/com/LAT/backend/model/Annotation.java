package com.LAT.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Annotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String selectedWord;

    private String text;

    @JsonIgnoreProperties({"annotations"})
    @ManyToOne
    @JoinColumn(name = "lawClass_id")
    private LawClass lawClass;

    @JsonIgnoreProperties({"annotations"})
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;


    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public void setLawClass(LawClass lawClass) {
        this.lawClass = lawClass;
    }

    public LawClass getLawClass() {
        return lawClass;
    }

    public int getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSelectedWord() {
        return selectedWord;
    }

    public void setSelectedWord(String selectedWord) {
        this.selectedWord = selectedWord;
    }
}
