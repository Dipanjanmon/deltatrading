# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the build artifact from the host to the container
# Note: This assumes you have run 'mvn clean package' locally or in a build stage
# For a multi-stage build (safer for reproducibility):
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Make the wrapper executable
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Run the jar file
# The jar file path depends on your pom.xml (artifactId-version)
CMD ["java", "-jar", "target/deltatrading-0.0.1-SNAPSHOT.jar"]
