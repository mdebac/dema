package com.infodema.webcreator.domain.payments;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StripeDemaResponse {
    private String status;
    private String message;
    private String sessionId;
    private String sessionUrl;
}
