package com.infodema.webcreator.domain.utility;

import lombok.experimental.UtilityClass;

@UtilityClass
public class Const {

    @UtilityClass
    public class Format {
        /**
         * ISO 8601 date time format <code>yyyy-MM-dd'T'HH:mm:ss.SSSZ</code>
         * eg. <code>2019-12-31T23:59:59.999+0100</code>
         */
        public static final String ISO_DATE_TIME = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
        /**
         * ISO 8601 date format <code>yyyy-MM-dd</code>
         * eg. <code>2019-12-31</code>
         */
        public static final String ISO_DATE = "yyyy-MM-dd";
    }

}

