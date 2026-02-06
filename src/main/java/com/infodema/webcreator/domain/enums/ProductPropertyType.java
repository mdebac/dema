package com.infodema.webcreator.domain.enums;

public enum ProductPropertyType {
    INTEGER("INTEGER"),
    STRING("STRING"),
    DATE("DATE"),
    BOOLEAN("BOOLEAN");

    private final String code;

    ProductPropertyType(String code) {
        this.code = code;
    }

    public String getCountryCode() {
        return code;
    }

    public static ProductPropertyType fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (ProductPropertyType productDataType : values()) {
            if (productDataType.code.equals(code)) {
                return productDataType;
            }
        }
        throw new RuntimeException("No ProductPropertyType for code: " + code);
    }
}
