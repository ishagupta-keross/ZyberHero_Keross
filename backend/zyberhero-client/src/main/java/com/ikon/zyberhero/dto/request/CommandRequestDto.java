package com.ikon.zyberhero.dto.request;

import lombok.Data;

@Data
public class CommandRequestDto {
    private String deviceUuid;
    private Long deviceId;
    private String appName;
    private String schedule;
}
