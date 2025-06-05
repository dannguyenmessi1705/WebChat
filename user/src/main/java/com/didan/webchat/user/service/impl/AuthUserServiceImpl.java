package com.didan.webchat.user.service.impl;

import com.didan.archetype.factory.response.GeneralResponse;
import com.didan.archetype.locale.Translator;
import com.didan.archetype.service.MinioService;
import com.didan.webchat.user.constant.RoleConstant;
import com.didan.webchat.user.dto.mapping.UserDTO;
import com.didan.webchat.user.dto.request.RegisterRequestDTO;
import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserRole;
import com.didan.webchat.user.entity.UserStatus;
import com.didan.webchat.user.exception.ResourceAlreadyExistException;
import com.didan.webchat.user.exception.ResourceNotFoundException;
import com.didan.webchat.user.mapping.UserMapper;
import com.didan.webchat.user.repository.RoleRepository;
import com.didan.webchat.user.repository.UserRepository;
import com.didan.webchat.user.repository.UserRoleRepository;
import com.didan.webchat.user.service.AuthUserService;
import com.didan.webchat.user.util.ImageGenerateUtils;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthUserServiceImpl implements AuthUserService {

  private final UserRepository userRepository;
  private final MinioService minioService;
  private final PasswordEncoder passwordEncoder;
  private final UserRoleRepository userRoleRepository;
  private final RoleRepository roleRepository;
  private final UserMapper userMapper;

  private static final String BUCKET_AVATAR = "avatar";

  @Override
  public UserDTO register(RegisterRequestDTO registerRequestDTO) {
    checkExistInfoUser(registerRequestDTO.getUsername(), registerRequestDTO.getEmail());
    String avatarPath;
        if (Objects.nonNull(registerRequestDTO.getFile()) && !registerRequestDTO.getFile().isEmpty()) {
      log.info("Start handle file for user: {}", registerRequestDTO.getUsername());
      minioService.createBucket(BUCKET_AVATAR);
      String fileName = registerRequestDTO.getFile().getOriginalFilename();
      avatarPath = String.format("%s_%s.%s", BUCKET_AVATAR, registerRequestDTO.getUsername(), fileName.split("\\.")[1]);
      minioService.uploadFile(BUCKET_AVATAR, registerRequestDTO.getFile(), avatarPath, registerRequestDTO.getFile().getContentType());
      log.info("File uploaded successfully for user: {}", registerRequestDTO.getUsername());
    } else {
      log.info("Generating default avatar for user: {}", registerRequestDTO.getUsername());
      byte[] defaultAvatar = ImageGenerateUtils.generateAvatar(registerRequestDTO.getUsername(), 480);
      InputStream inputStream = new ByteArrayInputStream(defaultAvatar);
      avatarPath = String.format("%s_%s.png", BUCKET_AVATAR, registerRequestDTO.getUsername());
      minioService.createBucket(BUCKET_AVATAR);
      minioService.uploadFile(BUCKET_AVATAR, avatarPath, inputStream, MediaType.IMAGE_PNG_VALUE);
    }
    User user = User.builder()
        .email(registerRequestDTO.getEmail())
        .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
        .fullName(registerRequestDTO.getFullName())
        .username(registerRequestDTO.getUsername())
        .profilePicture(avatarPath)
        .status(UserStatus.ACTIVE)
        .build();
    userRepository.saveAndFlush(user);
    log.info("User registered successfully for user: {}", registerRequestDTO.getUsername());

    // Set default role for user
    UserRole userRole = UserRole.builder()
        .user(user)
        .role(roleRepository.findByName(RoleConstant.ROLE_USER.name())
            .orElseThrow(() -> new ResourceNotFoundException(
                Translator.toLocale("msg.role.not.found", RoleConstant.ROLE_USER))))
        .build();
    userRoleRepository.save(userRole);
    log.info("Default role assigned to user: {}", registerRequestDTO.getUsername());
    return userMapper.toDTO(user);
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
