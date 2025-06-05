package com.didan.webchat.user.exception;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author dannd1
 * @since 6/5/2025
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldError implements Serializable {
  private String field;
  private String description;
}
