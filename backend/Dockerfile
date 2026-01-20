# Multi-stage Dockerfile for multi-module backend (builds zyberhero-client + zyberhero-server)
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy the parent pom so Maven can download dependencies
COPY pom.xml ./

# Copy child module poms so Maven can resolve multi-module dependencies without copying full source
# This keeps layer caching effective while still allowing dependency:go-offline to work.
COPY zyberhero-client/pom.xml zyberhero-client/pom.xml
COPY zyberhero-server/pom.xml zyberhero-server/pom.xml

# Download dependencies for all modules (uses the base Maven installation in the image)
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests dependency:go-offline

# Copy everything and build the multi-module project
COPY . .
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests package

# Runtime image
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the server module jar from the build stage
# Adjust path if artifact name differs
COPY --from=build /workspace/zyberhero-server/target/*.jar /app/app.jar

EXPOSE 8060

ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
