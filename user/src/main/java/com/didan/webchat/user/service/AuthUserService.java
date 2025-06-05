package com.didan.webchat.user.service;

import com.didan.webchat.user.dto.mapping.UserDTO;
import com.didan.webchat.user.dto.request.RegisterRequestDTO;

public interface AuthUserService {

  UserDTO register(RegisterRequestDTO registerRequestDTO);

  void checkExistInfoUser(String username, String email);
}
