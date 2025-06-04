package com.didan.webchat.user.service;

import com.didan.webchat.user.dto.mapping.UserDTO;
import com.didan.webchat.user.dto.request.RegisterRequestDTO;
import org.springframework.http.ResponseEntity;

public interface AuthService {
  ResponseEntity<UserDTO> register(RegisterRequestDTO registerRequestDTO);

  void checkExistInfoUser(String username, String email);
}
