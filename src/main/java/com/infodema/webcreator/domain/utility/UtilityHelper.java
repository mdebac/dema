package com.infodema.webcreator.domain.utility;

import com.infodema.webcreator.domain.enums.Hosts;
import lombok.experimental.UtilityClass;

import java.time.*;

@UtilityClass
public class UtilityHelper {

    public static OffsetDateTime toOffsetDateTime(Instant instant) {
        ZoneId z = ZoneId.of("Europe/Berlin");
        ZonedDateTime zdt = instant.atZone(z);
        return zdt.toOffsetDateTime();
    }


    public static OffsetDateTime toOffsetDateTime(LocalDateTime localDateTime) {
        ZoneOffset offset = ZoneOffset.UTC;
        return localDateTime.atOffset(offset);
    }

    public static String resolveHostForDevelopment(String host) {
        if (host.equals("localhost:8081")) {
               return Hosts.INFO_DEMA_EU.getHostsCode();
           // return Hosts.DEMA_APARTMENTS.getHostsCode();
            // return Hosts.ADRIATICSUN_EU.getHostsCode();
        }
        return host;
    }

}
