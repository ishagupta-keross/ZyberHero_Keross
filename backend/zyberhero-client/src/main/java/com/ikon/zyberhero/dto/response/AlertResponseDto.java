package com.ikon.zyberhero.dto.response;

import java.time.Instant;

import lombok.Data;

@Data
public class AlertResponseDto {
    private Long id;
    private Instant timestamp;
    private String appName;
    private String type;
    private String details;
    private Long deviceId;
}
