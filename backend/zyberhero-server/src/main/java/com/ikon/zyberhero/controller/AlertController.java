package com.ikon.zyberhero.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.ikon.zyberhero.api.AlertApi;
import com.ikon.zyberhero.dto.request.AlertCreateRequestDto;
import com.ikon.zyberhero.dto.response.AlertResponseDto;
import com.ikon.zyberhero.service.AlertService;

@RestController
@RequiredArgsConstructor
public class AlertController implements AlertApi {

    private final AlertService alertService;

    @Override
    public ResponseEntity<?> createAlert(String accessToken, AlertCreateRequestDto request) {
        try {
            Long id = alertService.createAlert(request);
            return ResponseEntity.created(URI.create("/api/alerts/" + id)).body(Map.of("id", id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to save alert"));
        }
    }

    @Override
    public ResponseEntity<AlertResponseDto> latest(String accessToken, String deviceUuid, Long deviceId) {
        try {
            if (deviceId == null) return ResponseEntity.badRequest().build();
            var optional = alertService.latestForDevice(deviceId);
            return optional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.ok(null));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<List<AlertResponseDto>> list(String accessToken, String deviceUuid, Long deviceId) {
        if (deviceId == null) return ResponseEntity.badRequest().build();
        var list = alertService.listForDevice(deviceId, 20);
        return ResponseEntity.ok(list);
    }

    @Override
    public ResponseEntity<?> countLast24h(String accessToken) {
        long count = alertService.countLast24h();
        return ResponseEntity.ok(Map.of("count", count));
    }

}
