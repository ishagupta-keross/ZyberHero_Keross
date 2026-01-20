package com.ikon.zyberhero.dto.response;

import java.time.Instant;

import lombok.Data;

@Data
public class SafeZoneResponseDto {
    private Long id;
    private Long childId;
    private String name;
    private Double latitude;
    private Double longitude;
    private Integer radius;
    private String address;
    private Instant createdAt;
}
