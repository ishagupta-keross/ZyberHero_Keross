package com.ikon.zyberhero.dto.request;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.Instant;

import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
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
