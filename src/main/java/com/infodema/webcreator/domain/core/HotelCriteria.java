package com.infodema.webcreator.domain.core;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class HotelCriteria {
    private String chip;
    private Long userId;
    private String title;
    private String host;
}
