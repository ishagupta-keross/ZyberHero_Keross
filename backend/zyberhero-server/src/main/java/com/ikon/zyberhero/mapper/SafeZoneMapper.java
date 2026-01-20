package com.ikon.zyberhero.mapper;

import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.stereotype.Component;

import com.ikon.zyberhero.dto.request.SafeZoneCreateRequestDto;
import com.ikon.zyberhero.dto.response.SafeZoneResponseDto;
import com.ikon.zyberhero.entity.SafeZone;

@Component
public class SafeZoneMapper {

    public SafeZone mapFromDto(SafeZoneCreateRequestDto req) {
        if (req == null) return null;
        
        SafeZone safeZone = new SafeZone();
        safeZone.setName(req.getName());
        safeZone.setLatitude(req.getLatitude());
        safeZone.setLongitude(req.getLongitude());
        safeZone.setRadius(req.getRadius() == null ? 500 : req.getRadius()); // default 500m
        safeZone.setAddress(req.getAddress() == null ? "" : req.getAddress());
        safeZone.setCreatedAt(LocalDateTime.now());
        // childId and deviceId should be set by the service after resolution
        return safeZone;
    }

    public SafeZoneResponseDto mapToDto(SafeZone safeZone) {
        if (safeZone == null) return null;
        
        SafeZoneResponseDto dto = new SafeZoneResponseDto();
        dto.setId(safeZone.getId());
        dto.setChildId(safeZone.getChildId());
        dto.setName(safeZone.getName());
        dto.setLatitude(safeZone.getLatitude());
        dto.setLongitude(safeZone.getLongitude());
        dto.setRadius(safeZone.getRadius());
        dto.setAddress(safeZone.getAddress());
        dto.setCreatedAt(safeZone.getCreatedAt() == null ? null : 
            safeZone.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant());
        return dto;
    }
}
