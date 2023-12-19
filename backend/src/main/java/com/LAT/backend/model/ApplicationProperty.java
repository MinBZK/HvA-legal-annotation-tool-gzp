package com.LAT.backend.model;

import jakarta.persistence.*;

@Entity
public class ApplicationProperty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_name")
    private String propertyName;

    @Column(name = "property_value")
    private int propertyValue;

    public Long getId() {
        return id;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public int getPropertyValue() {
        return propertyValue;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public void setPropertyValue(int propertyValue) {
        this.propertyValue = propertyValue;
    }
}
