package com.ikon.zyberhero.mapper;

import org.springframework.stereotype.Component;

import com.ikon.zyberhero.dto.request.ChildCreateRequestDto;
import com.ikon.zyberhero.dto.response.ChildResponseDto;
import com.ikon.zyberhero.dto.response.DeviceSummaryDto;
import com.ikon.zyberhero.entity.Child;
import com.ikon.zyberhero.entity.Device;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ChildMapper {

    public Child mapFromDto(ChildCreateRequestDto dto) {
        if (dto == null) return null;
        Child c = new Child();
        c.setName(dto.getName());
        c.setAge(dto.getAge());
        c.setGender(dto.getGender());
        if (dto.getDob() != null && !dto.getDob().isEmpty()) {
            c.setDob(LocalDate.parse(dto.getDob()));
        }
        c.setPhone(dto.getPhone());
        // c.setParentId(dto.getParentId());
        c.setCreatedAt(LocalDateTime.now());
        return c;
    }

    public ChildResponseDto mapToDto(Child c, List<Device> devices) {
        if (c == null) return null;
        ChildResponseDto r = new ChildResponseDto();
        r.setId(c.getId());
        r.setName(c.getName());
        r.setAge(c.getAge());
        r.setGender(c.getGender());
        r.setDob(c.getDob() != null ? c.getDob().toString() : null);
        r.setPhone(c.getPhone());
        r.setCreatedAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
        if (devices != null) {
            List<DeviceSummaryDto> devs = devices.stream().map(d -> {
                DeviceSummaryDto sd = new DeviceSummaryDto();
                sd.setId(d.getId());
                sd.setDeviceUuid(d.getDeviceUuid());
                sd.setMachineName(d.getMachineName());
                sd.setUserName(d.getUserName());
                sd.setMacAddress(d.getMacAddress());
                return sd;
            }).collect(Collectors.toList());
            r.setDevices(devs);
        }
        return r;
    }
}
