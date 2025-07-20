# Build stage
FROM maven:3.8.7-openjdk-18 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

#FROM node:22-alpine as build
#WORKDIR /build
#COPY package*.json ./
#RUN npm install -g @angular/cli
#RUN npm run build --configuration=production

#FROM nginx:alpine
#COPY nginx.conf /etc/nginx/nginx.conf
#COPY --from=build-stage /app/dist/book-network-ui /usr/share/nginx/html


# Runtime stage
FROM amazoncorretto:17
ARG PROFILE=dev
ARG APP_VERSION=1.0.12
ARG EMAIL_HOST_NAME=smtp.gmail.com
ARG EMAIL_USERNAME=debacmarko@gmail.com
ARG EMAIL_PASSWORD=rglq zrwp vrly zplt

WORKDIR /app
COPY --from=build /build/target/dema-*.jar /app/

EXPOSE 8081

ENV ACTIVE_PROFILE="${PROFILE}"
ENV JAR_VERSION="${APP_VERSION}"
ENV EMAIL_HOST_NAME: "${EMAIL_HOST_NAME}"
ENV EMAIL_USERNAME: "${EMAIL_USERNAME}"
ENV EMAIL_PASSWORD: "${EMAIL_PASSWORD}"
ENV RECAPTCHA_SECRET: "${RECAPTCHA_SECRET}"
CMD java -jar -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -Dspring.profiles.active="${ACTIVE_PROFILE}" -Dgoogle.recaptcha.secret="${RECAPTCHA_SECRET}" -Dspring.datasource.url="${DB_URL}" -Dspring.mail.host="${EMAIL_HOST_NAME}" -Dspring.mail.username="${EMAIL_USERNAME}" -Dspring.mail.password="${EMAIL_PASSWORD}" dema-${JAR_VERSION}.jar
