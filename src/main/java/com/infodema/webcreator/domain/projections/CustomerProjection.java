package com.infodema.webcreator.domain.projections;

import java.math.BigDecimal;

public interface CustomerProjection {
    Long getCustomerId();
    String getRole();
    String getName();
    String getEmail();
    String getHost();
    BigDecimal getPrice();
}
