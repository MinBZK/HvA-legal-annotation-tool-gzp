package com.LAT.backend.service;

import com.LAT.backend.model.ApplicationProperty;
import com.LAT.backend.repository.ApplicationPropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ApplicationPropertyService {

    @Autowired
    private ApplicationPropertyRepository applicationPropertyRepository;

    public int getMaxXmlFiles() {
        Optional<ApplicationProperty> property = applicationPropertyRepository.findByPropertyName("max_xml_files");
        return property.map(ApplicationProperty::getPropertyValue).orElse(40);
    }
}
