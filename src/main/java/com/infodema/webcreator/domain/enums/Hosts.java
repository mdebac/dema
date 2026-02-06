package com.infodema.webcreator.domain.enums;

public enum Hosts {

    ADRIATICSUN_EU("adriaticsun.eu"),
    VILLA_DUBRAVKA_SAMOBOR_COM("villa-dubravka-samobor.com"),
    CANNABIS_OIL_SHOP("cannabis-oil.shop"),
    DEMA_APARTMENTS("dema-apartments.eu"),
    INFO_DEMA_EU("info-dema.eu"),
    DEV_NEWS_EU("dev-news.eu"),
    RESIDENCE_INFO_DEMA_EU("residence.info-dema.eu"),
    INFO_DEMA_TEST1_COM("info-dema-test1.com");
//<a href="https://www.flaticon.com/free-icons/cannabis-oil" title="cannabis oil icons">Cannabis oil icons created by surang - Flaticon</a>
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
