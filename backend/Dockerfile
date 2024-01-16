# Use an official Maven image as a base image for the build stage
FROM maven:3.8-openjdk-17 AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the pom.xml file to the working directory
COPY pom.xml .

# Download the Maven dependencies (only dependencies are downloaded, not the full source code)
RUN mvn dependency:go-offline

# Copy the remaining source code to the working directory
COPY src ./src

# Build the Spring Boot application and copy the JAR
RUN mvn package -DskipTests && cp target/*.jar /usr/src/app/app.jar

# Use an official OpenJDK runtime as a base image for the final stage
FROM openjdk:17

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the JAR file from the builder stage to the container
COPY --from=builder /usr/src/app/app.jar .

# Expose the port that the Spring Boot app will run on
EXPOSE 8000

# Command to run the Spring Boot application
CMD ["java", "-jar", "app.jar"]