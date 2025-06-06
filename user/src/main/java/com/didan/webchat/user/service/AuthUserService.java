package com.didan.webchat.user.service;

import com.didan.webchat.user.dto.mapping.UserDTO;
import com.didan.webchat.user.dto.request.LoginRequestDTO;
import com.didan.webchat.user.dto.request.RegisterRequestDTO;
import com.didan.webchat.user.dto.response.LoginResponseDTO;

public interface AuthUserService {

  UserDTO register(RegisterRequestDTO registerRequestDTO);

  void checkExistInfoUser(String username, String email);

  LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
}
