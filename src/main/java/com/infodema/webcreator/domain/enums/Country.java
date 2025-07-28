package com.infodema.webcreator.domain.enums;

public enum Country {
    HR("HR"),
    FR("FR"),
    NL("NL"),
    DE("DE"),
    EN("GB-eng"),
    ES("ES"),
    DK("DK"),
    SE("SE"),
    FI("FI"),
    IT("IT"),
    HU("HU"),
    PL("PL"),
    UA("UA"),
    RU("RU"),
    NO("NO"),
    CZ("CZ");

    private final String code;

    Country(String code) {
        this.code = code;
    }

    public String getCountryCode() {
        return code;
    }

    public static Country fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (Country country : values()) {
            if (country.code.equals(code)) {
                return country;
            }
        }
        throw new RuntimeException("No Country for code: " + code);
    }
}
