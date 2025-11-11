package com.infodema.webcreator.exceptions;

import com.infodema.webcreator.exceptions.types.ApiError;
import com.infodema.webcreator.exceptions.types.BusinessException;
import jakarta.annotation.Nonnull;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Arrays;
import java.util.List;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class ExceptionControllerAdvice extends ResponseEntityExceptionHandler {

    private final Environment environment;

    @ExceptionHandler(EntityNotFoundException.class)
    protected ResponseEntity<Object> handleNotFoundException(EntityNotFoundException ex) {
        log.warn(ex.getMessage(), ex);
        ApiError apiError = new ApiError(HttpStatus.NOT_FOUND);
        apiError.setMessage(ex.getMessage());
        return buildResponseEntity(apiError, ex);
    }

    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<Object> handleNotFoundException(BusinessException ex) {
        log.warn(ex.getMessage(), ex);
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR);
        apiError.setMessage(ex.getMessage());
        return buildResponseEntity(apiError, ex);
    }

    @ExceptionHandler(RuntimeException.class)
    protected ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        log.warn(ex.getMessage(), ex);
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR);
        apiError.setMessage("Unexpected error occurred: " + ex.getMessage());

        return buildResponseEntity(apiError, ex);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            @Nonnull Exception ex,
            Object body,
            @Nonnull HttpHeaders headers,
            @Nonnull HttpStatusCode statusCode,
            @Nonnull WebRequest request) {
        log.warn(ex.getMessage(), ex);
        return super.handleExceptionInternal(ex, body, headers, statusCode, request);
    }

    private ResponseEntity<Object> buildResponseEntity(ApiError apiError, Throwable ex) {
        List<String> profiles = Arrays.asList(environment.getActiveProfiles());
        if (!profiles.contains("dev")) {
            apiError.setDebugMessage(ExceptionUtils.getStackTrace(ex));
        }
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }
}
