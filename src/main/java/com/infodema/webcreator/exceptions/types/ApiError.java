package com.infodema.webcreator.exceptions.types;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.infodema.webcreator.domain.utility.Const;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class ApiError {

    private final HttpStatus status;

    @JsonFormat(pattern = Const.Format.ISO_DATE_TIME)
    private final OffsetDateTime timestamp;

    private String message;
    private String debugMessage;
    private List<ApiSubError> subErrors;

    public ApiError(HttpStatus status) {
        timestamp = OffsetDateTime.now();
        this.status = status;
    }

    public void addSubError(ApiSubError subError) {
        if (subErrors == null) {
            subErrors = new ArrayList<>();
        }
        subErrors.add(subError);
    }
}
