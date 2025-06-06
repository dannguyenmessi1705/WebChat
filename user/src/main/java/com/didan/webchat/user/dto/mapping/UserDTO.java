package com.didan.webchat.user.dto.mapping;

import com.didan.webchat.user.constant.UserStatus;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {

  private Long id;

  private String username;

  private String email;

  private String fullName;

  private LocalDateTime createdAt;

  private UserStatus status;
}
