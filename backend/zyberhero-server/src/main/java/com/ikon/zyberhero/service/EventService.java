package com.ikon.zyberhero.service;

import com.ikon.zyberhero.dto.request.EventCreateRequestDto;
import com.ikon.zyberhero.dto.response.EventResponseDto;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;



public interface EventService {

    EventResponseDto createEvent(EventCreateRequestDto requestDto);

    Page<EventResponseDto> getAllEvents(Pageable pageable);

    Page<EventResponseDto> getEventsByIdentifier(UUID sourceIdentifier, Pageable pageable);

    EventResponseDto getEventById(UUID eventId);

    EventResponseDto updateEvent(UUID eventId, EventCreateRequestDto requestDto);
}
