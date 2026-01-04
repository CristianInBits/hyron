# Etapa 1: Compilar el código (Build)
FROM gradle:8.5-jdk21 AS build
WORKDIR /app
COPY . .
# Crea el .jar sin ejecutar los tests para ir más rápido
RUN ./gradlew bootJar -x test --no-daemon

# Etapa 2: Ejecutar (Run)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
# Copiamos solo el .jar compilado de la etapa anterior
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]