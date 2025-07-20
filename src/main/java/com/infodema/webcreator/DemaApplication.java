package com.infodema.webcreator;

import com.infodema.webcreator.domain.Message;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@RestController
public class DemaApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemaApplication.class, args);
    }


  @GetMapping(path = "/api/v1/apartments/ping", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Message> generateUrl() {
    //log.debug("generateUrl by title={}", title);

    return new ResponseEntity<>(
      Message.builder().text("pong").build(),
      HttpStatus.OK);
  }

}
