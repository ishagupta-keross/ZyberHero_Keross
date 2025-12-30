package com.ikon.zyberhero.mapper;

import org.springframework.stereotype.Component;

import com.ikon.zyberhero.dto.request.DeviceRegisterRequestDto;
import com.ikon.zyberhero.dto.response.DeviceResponseDto;
import com.ikon.zyberhero.entity.Device;

@Component
public class DeviceMapper {

    public Device mapFromDto(DeviceRegisterRequestDto dto) {
        if (dto == null) return null;
        Device d = new Device();
        d.setDeviceUuid(dto.getDeviceUuid());
        d.setMacAddress(dto.getMacAddress());
        d.setMachineName(dto.getMachineName());
        d.setUserName(dto.getUserName());
        d.setOs(dto.getOs());
        d.setChildId(dto.getChildId());
        return d;
    }

    public DeviceResponseDto mapToDto(Device d) {
        if (d == null) return null;
        DeviceResponseDto r = new DeviceResponseDto();
        r.setDeviceId(d.getId());
        r.setDeviceUuid(d.getDeviceUuid());
        r.setChildId(d.getChildId());
        return r;
    }
}
