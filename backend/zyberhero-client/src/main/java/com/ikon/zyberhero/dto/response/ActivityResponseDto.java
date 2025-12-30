package com.ikon.zyberhero.dto.response;

import java.time.Instant;

import lombok.Data;

@Data
public class ActivityResponseDto {
    private Long id;
    private Instant timestamp;
    private Instant localTimestamp;
    private String appName;
    private String windowTitle;
    private Integer durationSeconds;
    private String executablePath;
    private Boolean screenTime;
    private Long deviceId;
}
