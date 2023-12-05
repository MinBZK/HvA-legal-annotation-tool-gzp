package com.LAT.backend.model;

import jakarta.persistence.*;

@Entity
public class AnnotationHasClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "annotation_id")
    private Annotation annotation;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class aClass;

    @Column(nullable = false)
    private Boolean isMainClass;

    public int getId() {
        return id;
    }

    public Annotation getAnnotation() {
        return annotation;
    }

    public void setAnnotation(Annotation annotation) {
        this.annotation = annotation;
    }

    public Class getaClass() {
        return aClass;
    }

    public void setaClass(Class aClass) {
        this.aClass = aClass;
    }

    public Boolean getMainClass() {
        return isMainClass;
    }

    public void setMainClass(Boolean mainClass) {
        isMainClass = mainClass;
    }
}
