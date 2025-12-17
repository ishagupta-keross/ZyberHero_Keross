// package com.ikon.zyberhero.controller;
package com.ikon.zyberhero.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.api.EventApi;
import com.ikon.zyberhero.dto.request.EventCreateRequestDto;
import com.ikon.zyberhero.dto.response.EventResponseDto;
import com.ikon.zyberhero.service.EventService;

import java.util.List;
import java.util.UUID;


import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

@RestController
@RequiredArgsConstructor
public class EventController implements EventApi {

    @Autowired
    private final EventService eventService;

    @Override
    public ResponseEntity<EventResponseDto> createEvent(@RequestHeader("Authorization") String accessToken,
            @RequestBody EventCreateRequestDto eventRequestDto) {
        EventResponseDto createdEvent = eventService.createEvent(eventRequestDto);
        return ResponseEntity.created(null).body(createdEvent);
    }

    @Override
    public ResponseEntity<Page<EventResponseDto>> getAllEvents(@RequestHeader("Authorization") String accessToken, Pageable pageable) {

        Page<EventResponseDto> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(events);
    }

    @Override
    public ResponseEntity<Page<EventResponseDto>> getEventsByIdentifier(
            @RequestHeader("Authorization") String accessToken, @PathVariable UUID sourceIdentifier, Pageable pageable) {
        Page<EventResponseDto> events = eventService.getEventsByIdentifier(sourceIdentifier, pageable);
        return ResponseEntity.ok(events);
    }

    @Override
    public ResponseEntity<EventResponseDto> getEventById(@RequestHeader("Authorization") String accessToken,
            @PathVariable("eventId") UUID eventId) {
        EventResponseDto event = eventService.getEventById(eventId);
        return ResponseEntity.ok(event);
    }

    @Override
    public ResponseEntity<EventResponseDto> updateEvent(@RequestHeader("Authorization") String accessToken,
            @PathVariable UUID eventId, @RequestBody EventCreateRequestDto eventRequestDto) {
        EventResponseDto updatedEvent = eventService.updateEvent(eventId, eventRequestDto);
        return ResponseEntity.ok(updatedEvent);
    }

}
