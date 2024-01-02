package com.LAT.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Objects;

@SpringBootApplication()
public class LatBackendApplication {

	public static void main(String[] args) {
		loadEnvVariables();
		SpringApplication.run(LatBackendApplication.class, args);
	}

	private static void loadEnvVariables() {
		Dotenv dotenv = Dotenv.configure()
				.filename(".env") // Specify the filename
				.directory("../")    // Specify the directory
				.load();

		System.setProperty("DB_URL", Objects.requireNonNull(dotenv.get("DB_URL")));
		System.setProperty("DB_USER", Objects.requireNonNull(dotenv.get("DB_USER")));
		System.setProperty("DB_PASS", Objects.requireNonNull(dotenv.get("DB_PASS")));
	}



}
