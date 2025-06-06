package com.didan.webchat.user.service;

import com.didan.webchat.user.dto.EventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventListener {
  private final LogActivityService logActivityService;

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void handleUserActivityEvent(EventDTO event) {
    log.info("Handling user activity event: {}", event.getEventName().name());
    logActivityService.logActivity(
        event.getUser(),
        event.getEventName(),
        event.getDescription()
    );
  }
}
