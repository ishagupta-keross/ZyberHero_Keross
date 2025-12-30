package com.ikon.zyberhero.mapper;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import com.ikon.zyberhero.dto.request.AlertCreateRequestDto;
import com.ikon.zyberhero.dto.response.AlertResponseDto;
import com.ikon.zyberhero.entity.Alert;

@Component
public class AlertMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Alert mapFromDto(AlertCreateRequestDto req) {
        if (req == null) return null;
        Alert a = new Alert();
        a.setAppName(req.getAppName() == null ? "unknown" : req.getAppName());
        a.setType(req.getType());
        a.setTimestamp(req.getTimestamp() != null ? LocalDateTime.ofInstant(req.getTimestamp(), ZoneOffset.UTC) : LocalDateTime.now());
        String finalDetails = "";
        if (req.getDetails() != null) {
            try {
                finalDetails = objectMapper.writeValueAsString(req.getDetails());
            } catch (Exception e) {
                finalDetails = String.valueOf(req.getDetails());
            }
        }
        a.setDetails(finalDetails);
        // deviceId should be set by the service after resolution
        return a;
    }

    public AlertResponseDto mapToDto(Alert a) {
        if (a == null) return null;
        AlertResponseDto d = new AlertResponseDto();
        d.setId(a.getId());
        d.setTimestamp(a.getTimestamp() == null ? null : a.getTimestamp().atZone(ZoneOffset.systemDefault()).toInstant());
        d.setAppName(a.getAppName());
        d.setType(a.getType());
        d.setDetails(a.getDetails());
        d.setDeviceId(a.getDeviceId());
        return d;
    }

}
