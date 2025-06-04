package com.didan.webchat.user.exception;

import com.didan.archetype.constant.ResponseStatusCode;
import com.didan.archetype.exception.GlobalExceptionHandler;
import com.didan.archetype.factory.response.GeneralResponse;
import com.didan.archetype.factory.response.ResponseStatus;
import com.didan.webchat.user.constant.ResponseStatusCodeEnumV2;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
public class CustomException extends GlobalExceptionHandler {

  @ExceptionHandler({ResourceAlreadyExistException.class})
  public ResponseEntity<Object> handleResourceAlreadyExistException(ResourceAlreadyExistException ex) {
    log.error("Resource already exists: {}", ex.getMessage());
    return this.createResponseV2(ResponseStatusCodeEnumV2.ALREADY_EXIST);
  }

  private ResponseEntity<Object> createResponseV2(ResponseStatusCode response) {
    ResponseStatus responseStatus = new ResponseStatus(response.getCode(), true);
    responseStatus.setResponseTime(new Date());
    GeneralResponse<Object> responseObject = new GeneralResponse<>();
    responseObject.setStatus(responseStatus);
    return new ResponseEntity<>(responseObject, HttpStatus.valueOf(response.getHttpCode()));
  }
}
