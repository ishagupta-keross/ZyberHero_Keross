package com.ikon.zyberhero.dto.request;

import java.time.Instant;

import lombok.Data;

@Data
public class AlertCreateRequestDto {
    private String deviceUuid;
    private Long deviceId;
    private String appName;
    private String type;
    private Instant timestamp;
    private Object details; // can be stringified JSON or object
    private String url;
    private String badWords;
    private String windowTitle;
}
