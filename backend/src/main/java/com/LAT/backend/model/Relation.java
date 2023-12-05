package com.LAT.backend.model;

import jakarta.persistence.*;

@Entity
public class Relation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "main_class_id")
    private Class mainClass;

    @ManyToOne
    @JoinColumn(name = "sub_class_id")
    private Class subClass;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String cardinality;

    public int getId() {
        return id;
    }

    public Class getMainClass() {
        return mainClass;
    }

    public void setMainClass(Class mainClass) {
        this.mainClass = mainClass;
    }

    public Class getSubClass() {
        return subClass;
    }

    public void setSubClass(Class subClass) {
        this.subClass = subClass;
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
