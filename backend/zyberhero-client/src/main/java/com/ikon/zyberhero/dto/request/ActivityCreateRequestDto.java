package com.ikon.zyberhero.dto.request;

import java.time.Instant;

import lombok.Data;


@Data

public class ActivityCreateRequestDto {
    private Instant timestamp;
    private Instant localTimestamp;
    private String appName;
    private String windowTitle;
    private Integer durationSeconds;
    private String executablePath;
    private Boolean screenTime = false;
    private String deviceUuid;
    private Long deviceId;
}
