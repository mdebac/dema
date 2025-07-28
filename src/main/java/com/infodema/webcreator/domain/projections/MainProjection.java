package com.infodema.webcreator.domain.projections;

import java.math.BigDecimal;

public interface MainProjection {
    Long getId();
    String getTitle();
    BigDecimal getPrice();
    String getDetailLabel();
    Long getDetailId();
}
