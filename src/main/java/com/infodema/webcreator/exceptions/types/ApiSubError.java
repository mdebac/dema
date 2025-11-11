package com.infodema.webcreator.exceptions.types;

import lombok.Data;

@Data
public class ApiSubError {
    private String path;
    private String message;
}
