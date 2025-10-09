package com.infodema.webcreator.domain.enums;

public enum Hosts {

    ADRIATICSUN_EU("adriaticsun.eu"),
    DEMA_APARTMENTS("dema-apartments.eu"),
    INFO_DEMA_EU("info-dema.eu");

    private final String code;

    Hosts(String code) {
        this.code = code;
    }

    public String getHostsCode() {
        return code;
    }

    public static Hosts fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (Hosts hosts : values()) {
            if (hosts.code.equals(code)) {
                return hosts;
            }
        }
        throw new RuntimeException("No Hosts for code: " + code);
    }
}
