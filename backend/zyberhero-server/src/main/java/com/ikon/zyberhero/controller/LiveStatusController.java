package com.ikon.zyberhero.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.ikon.zyberhero.api.LiveStatusApi;
import com.ikon.zyberhero.dto.request.LiveStatusRequestDto;
import com.ikon.zyberhero.dto.response.LiveAppResponseDto;
import com.ikon.zyberhero.service.LiveStatusService;

@RestController
public class LiveStatusController implements LiveStatusApi {

    private final LiveStatusService service;

    public LiveStatusController(LiveStatusService service) {
        this.service = service;
    }

    @Override
    public ResponseEntity<?> postLiveStatus(String accessToken, LiveStatusRequestDto request) {
        try {
            List<LiveAppResponseDto> apps = service.upsertLiveStatus(request);
            return ResponseEntity.ok(apps);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @Override
    public ResponseEntity<List<LiveAppResponseDto>> getLiveStatus(String accessToken, String deviceUuid, Long deviceId,
            Integer staleSeconds) {
        List<LiveAppResponseDto> apps = service.getRunningApps(deviceUuid, deviceId, staleSeconds);
        return ResponseEntity.ok(apps);
    }

}
