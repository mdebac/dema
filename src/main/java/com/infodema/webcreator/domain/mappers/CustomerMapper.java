package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.Customer;
import com.infodema.webcreator.domain.utility.UtilityHelper;
import com.infodema.webcreator.persistance.entities.security.Role;
import com.infodema.webcreator.persistance.entities.security.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CustomerMapper extends AbstractMapper {

    public Page<Customer> toDomain(Page<User> entities) {
        return convertPageCollection(entities, this::toDomain);
    }

    public List<Customer> toDomain(List<User> entities) {
        return convertCollection(entities, this::toDomain);
    }
    private Customer toDomain(User entity) {
        return Customer.builder()
                .id(entity.getId())
                .createdOn(UtilityHelper.toOffsetDateTime(entity.getCreatedDate()))
                .email(entity.getEmail())
                .role(entity.getRoles().stream().map(Role::getName).collect(Collectors.joining(",")))
                .host(entity.getHost())
                .name(entity.getFullName())
                .build();
    }


}
