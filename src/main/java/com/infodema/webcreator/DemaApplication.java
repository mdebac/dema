package com.infodema.webcreator;

import com.infodema.webcreator.domain.core.Message;
import com.infodema.webcreator.domain.enums.Hosts;
import com.infodema.webcreator.persistance.entities.security.Role;
import com.infodema.webcreator.persistance.entities.security.User;
import com.infodema.webcreator.persistance.repositories.security.RoleRepository;
import com.infodema.webcreator.persistance.repositories.security.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@SpringBootApplication
@RestController
public class DemaApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemaApplication.class, args);
    }


    @Bean
    public CommandLineRunner runner(RoleRepository roleRepository, UserRepository userRepository) {
        return args -> {
            if (roleRepository.findByName("USER").isEmpty()) {
                roleRepository.save(
                        Role.builder()
                                .name("USER")
                                .createdDate(OffsetDateTime.now().toLocalDateTime())
                                .build()
                );
            }
            if (roleRepository.findByName("ADMIN").isEmpty()) {
                roleRepository.save(
                        Role.builder()
                                .name("ADMIN")
                                .createdDate(OffsetDateTime.now().toLocalDateTime())
                                .build()
                );
            }
            if (roleRepository.findByName("MANAGER").isEmpty()) {
                roleRepository.save(
                        Role.builder()
                                .name("MANAGER")
                                .createdDate(OffsetDateTime.now().toLocalDateTime())
                                .build()
                );
            }
            if (roleRepository.findByName("TEST").isEmpty()) {
                roleRepository.save(
                        Role.builder()
                                .name("TEST")
                                .createdDate(OffsetDateTime.now().toLocalDateTime())
                                .build()
                );
            }

            if (userRepository.findByEmailAndHost("markodebac@yahoo.com", Hosts.INFO_DEMA_EU.getHostsCode()).isEmpty()) {
                var adminRole = roleRepository.findByName("ADMIN")
                        // todo - better exception handling
                        .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));
                var user = User.builder()
                        .firstname("Marko")
                        .lastname("Debac")
                        .email("markodebac@yahoo.com")
                        .password("$2a$10$tA0mxZBXGJn5rw/1GlYNI.aCEP80NAFu1vsrj/vCfSJu1gVZ1zJoq")
                        .accountLocked(false)
                        .host("info-dema.eu")
                        .enabled(true)
                        .roles(List.of(adminRole))
                        .build();
                userRepository.save(user);
            }

        };
    }


    @GetMapping(path = "/api/v1/ping", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> generateUrl() {
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
