package com.infodema.webcreator.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Message {
  String text;
}
