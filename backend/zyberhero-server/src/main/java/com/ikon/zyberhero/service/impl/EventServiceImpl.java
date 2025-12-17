package com.ikon.zyberhero.service.impl;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.ikon.zyberhero.dto.request.EventCreateRequestDto;
import com.ikon.zyberhero.dto.response.EventResponseDto;
import com.ikon.zyberhero.entity.Event;
import com.ikon.zyberhero.mapper.EventMapper;
import com.ikon.zyberhero.repository.EventRepository;
import com.ikon.zyberhero.service.EventService;
import com.ikon.webservice.WebService;

@Service
public class EventServiceImpl extends WebService implements EventService {

    @Autowired
    private EventMapper eventMapper;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public EventResponseDto createEvent(EventCreateRequestDto requestDto) {

        UUID accountId = getActiveAccountId();
        UUID createdBy = getCurrentUserId();
        String createdAt = LocalDateTime.now().toString();
        Event event = eventMapper.mapFromDto(requestDto);

        event.setAccountId(accountId);
        event.setCreatedBy(createdBy.toString());
        event.setCreatedAt(createdAt);

        Event savedEvent = eventRepository.save(event);

        return eventMapper.mapTo(savedEvent);
    }

    @Override
    public Page<EventResponseDto> getAllEvents(Pageable pageable) {

        UUID accountId = getActiveAccountId();

        Page<Event> entities = eventRepository.findByAccountId(accountId, pageable);

        return eventMapper.mapTo(entities);
    }

    @Override
    public Page<EventResponseDto> getEventsByIdentifier(UUID sourceIdentifier, Pageable pageable) {

        UUID accountId = getActiveAccountId();

        Page<Event> entities = eventRepository.findByAccountIdAndSourceIdentifier(accountId, sourceIdentifier, pageable);

        return eventMapper.mapTo(entities);
    }

    @Override
    public EventResponseDto getEventById(UUID eventId) {
        UUID accountId = getActiveAccountId();
        Event entity = eventRepository.findByIdAndAccountId(eventId, accountId);
        return eventMapper.mapTo(entity);
    }

    @Override
    public EventResponseDto updateEvent(UUID eventId, EventCreateRequestDto requestDto) {
        UUID accountId = getActiveAccountId();
        Event entity = eventRepository.findByIdAndAccountId(eventId, accountId);
        eventMapper.updateEntityFromDto(entity, requestDto);
        Event updatedEntity = eventRepository.save(entity);
        return eventMapper.mapTo(updatedEntity);
    }

   

}
