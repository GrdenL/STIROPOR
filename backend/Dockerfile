FROM eclipse-temurin:21-jdk

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends bash ca-certificates dos2unix \
  && rm -rf /var/lib/apt/lists/*

COPY gradlew /app/gradlew
COPY gradle /app/gradle
COPY build.gradle /app/build.gradle
COPY settings.gradle /app/settings.gradle

RUN dos2unix /app/gradlew || true \
  && chmod +x /app/gradlew

EXPOSE 8080
