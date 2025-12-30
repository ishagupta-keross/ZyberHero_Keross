package com.ikon.zyberhero.dto.response;

import java.time.Instant;
import lombok.Data;

@Data
public class LocationResponseDto {
    private Long id;
    private Double latitude;
    private Double longitude;
    private Double accuracy;
    private Double altitude;
    private Instant timestamp;
    private Long deviceId;
}
