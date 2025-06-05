package com.didan.webchat.user.service.impl;

import com.didan.archetype.locale.Translator;
import com.didan.webchat.user.dto.mapping.UserDTO;
import com.didan.webchat.user.dto.request.RegisterRequestDTO;
import com.didan.webchat.user.exception.ResourceAlreadyExistException;
import com.didan.webchat.user.repository.UserRepository;
import com.didan.webchat.user.service.AuthUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthUserServiceImpl implements AuthUserService {

  private final UserRepository userRepository;
//  private final MinioService minioService;

  @Override
  public ResponseEntity<UserDTO> register(RegisterRequestDTO registerRequestDTO) {
    checkExistInfoUser(registerRequestDTO.getUsername(), registerRequestDTO.getEmail());
    throw new ResourceAlreadyExistException(Translator.toLocale("msg.username.exist", registerRequestDTO.getUsername()));
//    UtilsCommon.trimObjectStringValues(registerRequestDTO);

//    if (Objects.nonNull(registerRequestDTO.getFile()) && !registerRequestDTO.getFile().isEmpty()) {
//
//      String fileName = minioService.uploadFile(registerRequestDTO.getFile(), "user-profile");
//      registerRequestDTO.setAvatar(fileName);
//    }
//    return null;
  }

  @Override
  public void checkExistInfoUser(String username, String email) {
    if (username != null && userRepository.existsByUsername(username)) {
      throw new ResourceAlreadyExistException(Translator.toLocale("msg.username.exist", username));
    }
    if (email != null && userRepository.existsByEmail(email)) {
      throw new ResourceAlreadyExistException(Translator.toLocale("msg.email.exist", email));
    }
  }
}
