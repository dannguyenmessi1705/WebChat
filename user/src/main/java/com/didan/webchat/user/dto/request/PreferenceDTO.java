package com.didan.webchat.user.dto.request;

import com.didan.webchat.user.constant.BooleanConstant;
import com.didan.webchat.user.constant.ThemeMode;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * @author dannd1
 * @since 6/16/2025
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PreferenceDTO {

  String language;
  ThemeMode themeMode;
  BooleanConstant notificationEnabled;
  BooleanConstant soundEnabled;
  String timezone;
}
