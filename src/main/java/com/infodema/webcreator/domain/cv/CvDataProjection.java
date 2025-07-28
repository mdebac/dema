package com.infodema.webcreator.domain.cv;

import java.time.Instant;

public interface CvDataProjection {
    Long getId();
    String getName();
    String getEmail();
    String getCoverLetterText();
    String getFileName();
    String getMimeType();
    Instant getCreatedOn();

}

