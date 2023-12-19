package com.LAT.backend;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
		"spring.datasource.url=${db.url}",
		"spring.datasource.username=${db.user}",
		"spring.datasource.password=${db.pass}"
})
class LatBackendApplicationTests {

	@BeforeAll
	static void setupSystemProperties() {
		// Set system properties based on Maven properties
		System.setProperty("DB_URL", System.getProperty("db.url"));
		System.setProperty("DB_USER", System.getProperty("db.user"));
		System.setProperty("DB_PASS", System.getProperty("db.pass"));
	}

	@Test
	void contextLoads() {
	}

}
