# Build stage
FROM maven:3.8.7-openjdk-18 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:17
ARG PROFILE=dev

WORKDIR /app
COPY --from=build /build/target/dema-*.jar /app/

EXPOSE 8081

ENV ACTIVE_PROFILE="${PROFILE}"
ENV APP_VERSION="${APP_VERSION}"
ENV EMAIL_HOST_NAME: "${EMAIL_HOST_NAME}"
ENV EMAIL_USERNAME: "${EMAIL_USERNAME}"
ENV EMAIL_PASSWORD: "${EMAIL_PASSWORD}"
ENV DB_URL: "${DB_URL}"
ENV DB_USERNAME: "${DB_USERNAME}"
ENV DB_PASSWORD: "${DB_PASSWORD}"
ENV DB_ROOT: "${DB_ROOT}"
ENV RECAPTCHA_SECRET: "${RECAPTCHA_SECRET}"
ENV SECRET_KEY: "${SECRET_KEY}"
ENV API_PORT: "${API_PORT}"
CMD java -jar -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -Dserver.port="${API_PORT}" -Dspring.profiles.active="${ACTIVE_PROFILE}" dema-*.jar
