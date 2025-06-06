package com.didan.webchat.user.service.impl;

import com.didan.archetype.config.properties.AppConfigProperties;
import com.didan.archetype.constant.TrackingContextEnum;
import com.didan.archetype.locale.Translator;
import com.didan.archetype.service.AuthService;
import com.didan.archetype.service.MinioService;
import com.didan.archetype.utils.UtilsCommon;
import com.didan.webchat.user.constant.ActivityType;
import com.didan.webchat.user.constant.RoleConstant;
import com.didan.webchat.user.constant.ThemeMode;
import com.didan.webchat.user.constant.TokenType;
import com.didan.webchat.user.constant.UserStatus;
import com.didan.webchat.user.dto.EventDTO;
import com.didan.webchat.user.dto.mapping.UserDTO;
import com.didan.webchat.user.dto.request.LoginRequestDTO;
import com.didan.webchat.user.dto.request.RegisterRequestDTO;
import com.didan.webchat.user.dto.response.LoginResponseDTO;
import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserPreference;
import com.didan.webchat.user.entity.UserRole;
import com.didan.webchat.user.entity.UserToken;
import com.didan.webchat.user.exception.BadRequestException;
import com.didan.webchat.user.exception.ResourceAlreadyExistException;
import com.didan.webchat.user.exception.ResourceNotFoundException;
import com.didan.webchat.user.mapping.UserMapper;
import com.didan.webchat.user.repository.RoleRepository;
import com.didan.webchat.user.repository.UserPreferenceRepository;
import com.didan.webchat.user.repository.UserRepository;
import com.didan.webchat.user.repository.UserRoleRepository;
import com.didan.webchat.user.service.AuthUserService;
import com.didan.webchat.user.service.LogActivityService;
import com.didan.webchat.user.service.UserTokenService;
import com.didan.webchat.user.util.ImageGenerateUtils;
import com.didan.webchat.user.util.ValidateUtils;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthUserServiceImpl implements AuthUserService {

  private final UserRepository userRepository;
  private final MinioService minioService;
  private final PasswordEncoder passwordEncoder;
  private final UserRoleRepository userRoleRepository;
  private final RoleRepository roleRepository;
  private final UserPreferenceRepository userPreferenceRepository;
  private final UserMapper userMapper;
  private final AuthService authService;
  private final ApplicationEventPublisher eventPublisher;
  private final LogActivityService logActivityService;
  private final UserTokenService userTokenService;
  private final AppConfigProperties appConfigProperties;

  private static final String BUCKET_AVATAR = "avatar";
  private static final String ERROR_MSG_LOGIN_FAILED = "msg.login.failed";

  @Value("${app.access-token.expired-in.seconds}")
  private long accessTokenExpiredInSeconds;
  @Value("${app.refresh-token.expired-in.seconds}")
  private long refreshTokenExpiredInSeconds;

  @Transactional
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

    // Set default preferences for the user
    UserPreference userPreference = UserPreference.builder()
        .user(user)
        .language("vi")
        .soundEnabled(true)
        .themeMode(ThemeMode.SYSTEM)
        .notificationEnabled(true)
        .timezone("UTC")
        .build();
    userPreferenceRepository.save(userPreference);

    // Publish user registration event
    logActivityService.logActivity(user, ActivityType.ACCOUNT_CREATION, "User registered successfully");
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

  @Override
  public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
    UtilsCommon.trimObjectStringValues(loginRequestDTO);
    User user;
    if (ValidateUtils.isValidEmail(loginRequestDTO.getUsername())) {
      user = userRepository.findByEmail(loginRequestDTO.getUsername())
          .orElseThrow(() -> {
            logActivityService.logActivity(null, ActivityType.FAILED_LOGIN_ATTEMPT, "Invalid email");
            return new BadRequestException(Translator.toLocale(ERROR_MSG_LOGIN_FAILED));
          });
    } else {
      user = userRepository.findByUsername(loginRequestDTO.getUsername())
          .orElseThrow(() -> {
            logActivityService.logActivity(null, ActivityType.FAILED_LOGIN_ATTEMPT, "Invalid username");
            return new BadRequestException(Translator.toLocale(ERROR_MSG_LOGIN_FAILED));
          });
    }
    if (user.getStatus() != UserStatus.ACTIVE) {
      logActivityService.logActivity(user, ActivityType.FAILED_LOGIN_ATTEMPT, "User is inactive");
      throw new BadRequestException(Translator.toLocale("msg.user.inactive"));
    }
    if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
      logActivityService.logActivity(user, ActivityType.FAILED_LOGIN_ATTEMPT, "Invalid password");
      throw new ResourceNotFoundException(Translator.toLocale(ERROR_MSG_LOGIN_FAILED));
    }
    log.info("User {} logged in successfully", user.getUsername());
    // Update last active time and online status
    user.setLastActive(LocalDateTime.now());
    user.setOnline(true);
    user.setUpdatedAt(LocalDateTime.now());
    userRepository.saveAndFlush(user);

    // Generate JWT token
    try {
      Map<String, Object> claims = new HashMap<>();
      claims.put(TrackingContextEnum.USER.getHeaderKey(), user.getUsername());
      claims.put("userId", user.getId());
      String accessToken = authService.signToken(claims, user.getUsername(), appConfigProperties.getApplicationShortName(), accessTokenExpiredInSeconds);
      userTokenService.saveToken(user, TokenType.ACCESS, accessToken, accessTokenExpiredInSeconds);
      String refreshToken = authService.signToken(claims, user.getUsername(), appConfigProperties.getApplicationShortName(), refreshTokenExpiredInSeconds);
      userTokenService.saveToken(user, TokenType.REFRESH, refreshToken, refreshTokenExpiredInSeconds);
      log.info("JWT tokens generated for user: {}", user.getUsername());
      // Log user activity
      logActivityService.logActivity(user, ActivityType.LOGIN, "User logged in successfully");
      return LoginResponseDTO.builder()
          .accessToken(accessToken)
          .refreshToken(refreshToken)
          .build();
    } catch (Exception e) {
      log.error("Error generating JWT token for user {}: {}", user.getUsername(), e.getMessage());
      throw new BadRequestException(Translator.toLocale(ERROR_MSG_LOGIN_FAILED));
    }
  }
}
