package com.didan.webchat.user.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequestDTO {

  @NotNull(message = "msg.fullname.required")
  @Size(min = 3, max = 100, message = "msg.fullname.size")
  String fullName;
  @Size(min = 3, max = 50, message = "msg.username.size")
  @NotNull(message = "msg.username.required")
  String username;
  @NotNull(message = "msg.email.required")
  @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z]{2,}$", message = "msg.email.invalid")
  String email;
  @NotNull(message = "msg.password.required")
  @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", message = "msg.password.invalid")
  String password;
  MultipartFile file;
}
