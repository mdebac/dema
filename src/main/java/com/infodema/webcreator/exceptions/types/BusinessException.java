package com.infodema.webcreator.exceptions.types;

import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
@NoArgsConstructor
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
