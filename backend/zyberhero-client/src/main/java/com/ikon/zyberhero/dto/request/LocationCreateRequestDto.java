package com.ikon.zyberhero.dto.request;

import java.time.Instant;
import lombok.Data;

@Data
public class LocationCreateRequestDto {
    private Long deviceId;
    private String deviceMac; // sent by C++ agent
    private Double latitude;
    private Double longitude;
    private Double accuracy;
    private Double altitude;
    private Instant timestamp;
}
