FROM amazoncorretto:17-alpine

COPY target/app-reclamos.war app.war

ENTRYPOINT ["java","-jar","/app.war"]