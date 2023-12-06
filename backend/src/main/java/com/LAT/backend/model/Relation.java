package com.LAT.backend.model;

import jakarta.persistence.*;

@Entity
public class Relation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "main_lawClass_id")
    private LawClass mainLawClass;

    @ManyToOne
    @JoinColumn(name = "sub_lawClass_id")
    private LawClass subLawClass;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String cardinality;

    public int getId() {
        return id;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCardinality() {
        return cardinality;
    }

    public void setCardinality(String cardinality) {
        this.cardinality = cardinality;
    }
}
