package com.LAT.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Relation {

    public enum Cardinality {V_1, NV_0_1_N, V_1_N, NV_0_1};

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "main_lawClass_id")
    private LawClass mainLawClass;

    @ManyToOne
    @JoinColumn(name = "sub_lawClass_id")
    private LawClass subLawClass;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Cardinality cardinality;
    @Column(nullable = false)
    private String description;

    @OneToMany(mappedBy= "relation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Annotation> annotations;

    public List<Annotation> getAnnotations() {
        return annotations;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setMainLawClass(LawClass mainLawClass) {
        this.mainLawClass = mainLawClass;
    }

    public void setSubLawClass(LawClass subLawClass) {
        this.subLawClass = subLawClass;
    }

    public LawClass getMainClass() {
        return mainLawClass;
    }

    public void setMainClass(LawClass mainLawClass) {
        this.mainLawClass = mainLawClass;
    }

    public LawClass getSubClass() {
        return subLawClass;
    }

    public void setSubClass(LawClass subLawClass) {
        this.subLawClass = subLawClass;
    }

    public Cardinality getCardinality() {
        return cardinality;
    }

    public void setCardinality(Cardinality cardinality) {
        this.cardinality = cardinality;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }




}
