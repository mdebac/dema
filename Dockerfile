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
ENV DB_USERNAME: "${DB_USERNAME}"
ENV DB_PASSWORD: "${DB_PASSWORD}"
ENV RECAPTCHA_SECRET: "${RECAPTCHA_SECRET}"
ENV SECRET_KEY: "${SECRET_KEY}"
ENV API_PORT: "${API_PORT}"
CMD java -jar -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -Dgoogle.recaptcha.secret="${RECAPTCHA_SECRET}"-Dspring.mail.host="${EMAIL_HOST_NAME}" -Dspring.mail.username="${EMAIL_USERNAME}" -Dspring.mail.password="${EMAIL_PASSWORD}" -Dspring.datasource.username="${DB_USERNAME}" -Dspring.datasource.password="${DB_PASSWORD}" -Dapplication.security.jwt.secret-key="${SECRET_KEY}" -Dserver.port="${API_PORT}" dema-${APP_VERSION}.jar