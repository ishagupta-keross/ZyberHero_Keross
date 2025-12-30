package com.ikon.zyberhero.dto.response;

import java.time.Instant;
import lombok.Data;

@Data
public class LiveAppResponseDto {
    private String appName;
    private String windowTitle;
    private Instant lastSeen;
}
