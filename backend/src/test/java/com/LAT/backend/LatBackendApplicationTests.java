package com.LAT.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Objects;

@SpringBootTest
@TestPropertySource(locations = "classpath:application.properties")
class LatBackendApplicationTests {

	static {
		Dotenv dotenv = Dotenv.configure()
				.filename(".env") // Specify the filename
				.load();

		System.setProperty("DB_URL", Objects.requireNonNull(dotenv.get("DB_URL")));
		System.setProperty("DB_USER", Objects.requireNonNull(dotenv.get("DB_USER")));
		System.setProperty("DB_PASS", Objects.requireNonNull(dotenv.get("DB_PASS")));
	}

	@Test
	void contextLoads() {
	}

}
