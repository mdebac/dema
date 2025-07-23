package com.infodema.webcreator;

import com.infodema.webcreator.domain.Message;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Map;

@SpringBootApplication
@RestController
public class DemaApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemaApplication.class, args);
    }


  @GetMapping(path = "/api/v1/apartments/ping", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Message> generateUrl() {
    //log.debug("generateUrl by title={}", title);
      System.out.println("ping");
    return new ResponseEntity<>(
      Message.builder().text("pong").build(),
      HttpStatus.OK);
  }

    @EventListener
    public void handleContextRefresh(ContextRefreshedEvent event) {
        ApplicationContext applicationContext = event.getApplicationContext();
        RequestMappingHandlerMapping requestMappingHandlerMapping = applicationContext
                .getBean("requestMappingHandlerMapping", RequestMappingHandlerMapping.class);
        Map<RequestMappingInfo, HandlerMethod> map = requestMappingHandlerMapping
                .getHandlerMethods();
        map.forEach((key, value) -> System.out.println("Endpoints: " + key + ": " + value));
    }

}
