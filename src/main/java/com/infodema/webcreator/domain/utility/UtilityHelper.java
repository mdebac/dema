package com.infodema.webcreator.domain.utility;

import lombok.experimental.UtilityClass;

import java.time.*;

@UtilityClass
public class UtilityHelper {

    public static OffsetDateTime toOffsetDateTime(Instant instant) {
        ZoneId z = ZoneId.of( "Europe/Berlin" ) ;
        ZonedDateTime zdt = instant.atZone( z ) ;
        return zdt.toOffsetDateTime();
    }


    public static OffsetDateTime toOffsetDateTime(LocalDateTime localDateTime) {
        ZoneOffset offset = ZoneOffset.UTC;
        return localDateTime.atOffset(offset);
    }

}
