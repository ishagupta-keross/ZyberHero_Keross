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

    private final EventService eventService;
    @Override
    public ResponseEntity<EventResponseDto> createEvent(String accessToken, EventCreateRequestDto eventRequestDto) { // api function inplementation
        // TODO Auto-generated method stub
        // throw new UnsupportedOperationException("Unimplemented method 'createEvent'");

        EventResponseDto createdEvent = eventService.createEvent(eventRequestDto); // service layer function call
        return ResponseEntity.status(201).body(createdEvent);
    }

    @Override
    public ResponseEntity<Page<EventResponseDto>> getAllEvents(String accessToken, Pageable pageable) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllEvents'");
    }

    @Override
    public ResponseEntity<Page<EventResponseDto>> getEventsByIdentifier(String accessToken, UUID sourceIdentifier,
            Pageable pageable) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getEventsByIdentifier'");
    }

    @Override
    public ResponseEntity<EventResponseDto> getEventById(String accessToken, UUID eventId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getEventById'");
    }

    @Override
    public ResponseEntity<EventResponseDto> updateEvent(String accessToken, UUID eventId,
            EventCreateRequestDto eventRequestDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateEvent'");
    }

  

}
