package com.ikon.zyberhero.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.ikon.zyberhero.api.LocationApi;
import com.ikon.zyberhero.dto.request.LocationCreateRequestDto;
import com.ikon.zyberhero.dto.response.LocationResponseDto;
import com.ikon.zyberhero.service.LocationService;

@RestController
public class LocationController implements LocationApi {

    private final LocationService service;

    public LocationController(LocationService service) {
        this.service = service;
    }

    @Override
    public ResponseEntity<?> createLocation(String accessToken, LocationCreateRequestDto request) {
        try {
            LocationResponseDto dto = service.createLocation(request);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @Override
    public ResponseEntity<LocationResponseDto> latest(String accessToken, String deviceUuid, Long deviceId) {
        LocationResponseDto d = service.latest(deviceUuid, deviceId);
        if (d == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(d);
    }


    @Override
    public ResponseEntity<List<LocationResponseDto>> history(String accessToken, String deviceUuid, Long deviceId,
            String date, Integer limit) {
        List<LocationResponseDto> list = service.history(deviceUuid, deviceId, date, limit);
        return ResponseEntity.ok(list);
    }

}