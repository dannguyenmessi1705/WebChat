package com.didan.webchat.user.exception;

import com.didan.archetype.constant.ResponseStatusCode;
import com.didan.archetype.factory.response.GeneralResponse;
import com.didan.archetype.factory.response.ResponseStatus;
import com.didan.webchat.user.constant.ResponseStatusCodeEnumV2;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class CustomException {

  @ExceptionHandler({ResourceAlreadyExistException.class})
  public ResponseEntity<Object> handleResourceAlreadyExistException(ResourceAlreadyExistException ex) {
    log.error("Resource already exists: {}", ex.getMessage());
    return createResponse(ResponseStatusCodeEnumV2.ALREADY_EXIST);
  }

  private ResponseEntity<Object> createResponse(ResponseStatusCode response) {
    ResponseStatus responseStatus = new ResponseStatus(response.getCode(), true);
    responseStatus.setResponseTime(new Date());
    GeneralResponse<Object> responseObject = new GeneralResponse<>();
    responseObject.setStatus(responseStatus);
    return new ResponseEntity<>(responseObject, HttpStatus.valueOf(response.getHttpCode()));
  }

  private ResponseEntity<GeneralResponse<Object>> returnFailData(GeneralResponse<Object> fieldErrors, String errorCode, String exception, String exception1) {
    ResponseStatus responseStatus = new ResponseStatus();
    responseStatus.setCode(errorCode);
    responseStatus.setDisplayMessage(exception);
    responseStatus.setMessage(exception1);
    responseStatus.setResponseTime(new Date());
    fieldErrors.setStatus(responseStatus);
    return ResponseEntity.ok(fieldErrors);
  }
}
