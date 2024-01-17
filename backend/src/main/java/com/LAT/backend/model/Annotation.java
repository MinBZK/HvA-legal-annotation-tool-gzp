package com.LAT.backend.model;

import com.LAT.backend.views.Views;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;

@Entity
public class Annotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.Basic.class)
    private int id;
    @JsonView(Views.Basic.class)
    private String selectedWord;
    @JsonView(Views.Basic.class)
    private String text;
    @ManyToOne
    @JoinColumn(name = "parent_annotation_id", nullable = true)
    @JsonView(Views.Extended.class)
    private Annotation parentAnnotation;

    public Annotation getParentAnnotation() {
        return parentAnnotation;
    }

    public void setParentAnnotation(Annotation parentAnnotation) {
        this.parentAnnotation = parentAnnotation;
    }

    @JsonIgnoreProperties({"annotations"})
    @ManyToOne
    @JoinColumn(name = "lawClass_id")
    private LawClass lawClass;

    @JsonIgnoreProperties({"annotations"})
    @ManyToOne
    @JoinColumn(name = "term_id")
    private Term term;


    @JsonIgnoreProperties({"annotations"})
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User created_by;

    @JsonView(Views.Basic.class)
    private Long created_at;

    @JsonView(Views.Basic.class)
    private Long updated_at;

    public void setLawClass(LawClass lawClass) {
        this.lawClass = lawClass;
    }

    public LawClass getLawClass() {
        return lawClass;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public Term getTerm() {
        return term;
    }

    public void setTerm(Term term) {
        this.term = term;
    }

    public long getCreated_at() {
        return created_at;
    }

    public void setCreated_at(long created_at) {
        this.created_at = created_at;
    }

    @Override
    public String toString() {
        return "Annotation{" +
                "id=" + id +
                ", selectedWord='" + selectedWord + '\'' +
                ", text='" + text + '\'' +
                ", parentAnnotation=" + parentAnnotation +
                ", lawClass=" + lawClass +
                ", term=" + term +
                ", created_by=" + created_by +
                ", created_at=" + created_at +
                '}';
    }

    public User getCreated_by() {
        return created_by;
    }

    public void setCreated_by(User created_by) {
        this.created_by = created_by;
    }

    public Long getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Long updated_at) {
        this.updated_at = updated_at;
    }
}
