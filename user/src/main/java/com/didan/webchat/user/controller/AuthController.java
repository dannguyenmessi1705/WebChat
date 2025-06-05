package com.didan.webchat.user.controller;

import com.didan.archetype.constant.ResponseStatusCodeEnum;
import com.didan.archetype.controller.restful.BaseController;
import com.didan.archetype.factory.response.GeneralResponse;
import com.didan.archetype.factory.response.ResponseFactory;
import com.didan.webchat.user.dto.request.RegisterRequestDTO;
import com.didan.webchat.user.service.AuthUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author dannd1
 * @since 6/3/2025
 */
@RestController
@RequestMapping("${app.application-short-name}/${app.version}/auth")
@RequiredArgsConstructor
@Slf4j
@Validated
public class AuthController extends BaseController {

  private final ResponseFactory responseFactory;
  private final AuthUserService authUserService;

  @PostMapping(value = "register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<GeneralResponse<Object>> register(
      @Valid @ModelAttribute RegisterRequestDTO requestDTO
  ) {
    log.info("==> Start controller register");
    return responseFactory.success(authUserService.register(requestDTO));
  }

  @PostMapping("login")
  public ResponseEntity<GeneralResponse<Object>> login() {
    log.info("==> Start controller login");
    try {
      return responseFactory.success("");
    } catch (Exception ex) {
      return responseFactory.fail(ResponseStatusCodeEnum.INTERNAL_GENERAL_SERVER_ERROR);
    }
  }
}
