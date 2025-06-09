package com.didan.webchat.user.util;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import lombok.experimental.UtilityClass;

@UtilityClass
public class DateUtils {
  public LocalDateTime convertTimeJwtToLocalDateTime(Long time) {
    if (time == null) {
      return null;
    }
    return LocalDateTime.ofInstant(Instant.ofEpochSecond(time), ZoneId.systemDefault());
  }
}
