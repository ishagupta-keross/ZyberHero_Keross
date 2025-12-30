package com.ikon.zyberhero.mapper;

import org.springframework.stereotype.Component;

import com.ikon.zyberhero.dto.response.CommandResponseDto;
import com.ikon.zyberhero.entity.ControlCommand;

@Component
public class CommandMapper {

    public CommandResponseDto mapToDto(ControlCommand c) {
        if (c == null) return null;
        CommandResponseDto d = new CommandResponseDto();
        d.setId(c.getId());
        d.setAppName(c.getAppName());
        d.setAction(c.getAction());
        d.setSchedule(c.getSchedule());
        return d;
    }

}
