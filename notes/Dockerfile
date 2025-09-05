# Stage 1: build with Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: run with lightweight JDK
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
CMD ["sh", "-c", "java -Xmx512m -Xms256m -jar app.jar --server.port=${PORT}"]
