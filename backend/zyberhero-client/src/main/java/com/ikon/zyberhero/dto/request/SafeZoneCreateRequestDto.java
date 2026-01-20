package com.ikon.zyberhero.dto.request;

import lombok.Data;

@Data
public class SafeZoneCreateRequestDto {
    private Long childId;
    private String name;
    private Double latitude;
    private Double longitude;
    private Integer radius; // in meters
    private String address;
    private String deviceUuid;
    private Long deviceId;
}
