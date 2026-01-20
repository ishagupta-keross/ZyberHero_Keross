# Multi-stage Dockerfile for Zyberhero Spring Boot service
# Build stage: use Maven with JDK17 to build the fat jar
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy pom so dependencies can be downloaded; rely on the Maven image (no wrapper needed)
COPY pom.xml ./

# Download dependencies (cache in /root/.m2)
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests dependency:go-offline

# Copy the source and build the project
COPY . .
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests package

# Runtime stage: slim JRE
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built jar (adjust if your artifact name is different)
COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8060

# Allow runtime java options via environment
ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
