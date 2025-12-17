package com.ikon.zyberhero.mapper;

import com.ikon.core.mapper.Mapper; // Assuming this is your generic mapper interface
import com.ikon.zyberhero.dto.request.EventCreateRequestDto;
import com.ikon.zyberhero.dto.response.EventResponseDto;
import com.ikon.zyberhero.entity.Event;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Component
@RequiredArgsConstructor
public class EventMapper implements Mapper<Event, EventResponseDto> {

    private final ModelMapper mapper;

    @Override
    public Event mapFrom(EventResponseDto responseDto) {
        return mapper.map(responseDto, Event.class);
    }

    @Override
    public EventResponseDto mapTo(Event entity) {
        return mapper.map(entity, EventResponseDto.class);
    }

    public Event mapFromDto(EventCreateRequestDto requestDto) {
        return mapper.map(requestDto, Event.class);
    }

    public void updateEntityFromDto(Event entity, EventCreateRequestDto requestDto) {
        mapper.map(requestDto, entity);
    }

    public Page<EventResponseDto> mapTo(Page<Event> entities) {
        return entities.map(this::mapTo);
    }
}