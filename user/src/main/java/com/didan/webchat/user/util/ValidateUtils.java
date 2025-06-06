package com.didan.webchat.user.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ValidateUtils {

  public boolean isValidEmail(String email) {
    if (email == null || email.isEmpty()) {
      return false;
    }
    Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    Matcher matcher = emailPattern.matcher(email);
    return matcher.matches();
  }
}
