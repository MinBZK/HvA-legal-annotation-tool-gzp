package com.LAT.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Objects;

@SpringBootApplication()
public class LatBackendApplication {

    public static void main(String[] args) {
        loadEnvVariables();
        if (System.getProperty("DB_URL") == null) {
            System.setProperty("DB_URL", System.getenv("DB_URL"));
            System.setProperty("DB_USER", System.getenv("DB_USER"));
            System.setProperty("DB_PASS", System.getenv("DB_PASS"));
        }
        SpringApplication.run(LatBackendApplication.class, args);
    }

    private static void loadEnvVariables() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .filename(".env") // Specify the filename
                    .directory("./") // Specify the directory
                    .load();

            System.setProperty("DB_URL", Objects.requireNonNull(dotenv.get("DB_URL")));
            System.setProperty("DB_USER", Objects.requireNonNull(dotenv.get("DB_USER")));
            System.setProperty("DB_PASS", Objects.requireNonNull(dotenv.get("DB_PASS")));
        } catch (Exception e) {
            System.out.println(".env file not found. Falling back to System.getenv()");
        }
    }

}
