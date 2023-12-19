package com.LAT.backend;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LatBackendApplicationTests {

	@BeforeAll
	static void setupSystemProperties() {
		// Set system properties based on GitLab CI/CD environment variables
		System.setProperty("DB_URL", System.getenv("CI_DB_URL"));
		System.setProperty("DB_USER", System.getenv("CI_DB_USER"));
		System.setProperty("DB_PASS", System.getenv("CI_DB_PASS"));
	}

	@Test
	void contextLoads() {
	}

}
