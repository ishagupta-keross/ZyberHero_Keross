package com.ikon.zyberhero.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.ikon.zyberhero.api.SafeZoneApi;
import com.ikon.zyberhero.dto.request.SafeZoneCreateRequestDto;
import com.ikon.zyberhero.dto.response.SafeZoneResponseDto;
import com.ikon.zyberhero.service.SafeZoneService;

@RestController
@RequiredArgsConstructor
public class SafeZoneController implements SafeZoneApi {

    private final SafeZoneService safeZoneService;

    @Override
    public ResponseEntity<?> createSafeZone(String accessToken, SafeZoneCreateRequestDto request) {
        try {
            Long id = safeZoneService.createSafeZone(request);
            SafeZoneResponseDto safeZone = safeZoneService.getSafeZone(id);
            return ResponseEntity.created(URI.create("/api/safezones/" + id))
                .body(Map.of("success", true, "safeZone", safeZone));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "error", "Failed to create safe zone"));
        }
    }

    @Override
    public ResponseEntity<List<SafeZoneResponseDto>> listSafeZones(String accessToken, Long childId) {
        List<SafeZoneResponseDto> list = safeZoneService.listSafeZones(childId);
        return ResponseEntity.ok(list);
    }

    @Override
    public ResponseEntity<?> getSafeZone(String accessToken, Long id) {
        try {
            SafeZoneResponseDto safeZone = safeZoneService.getSafeZone(id);
            return ResponseEntity.ok(Map.of("success", true, "safeZone", safeZone));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(404).body(Map.of("success", false, "error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "error", "Failed to retrieve safe zone"));
        }
    }

    @Override
    public ResponseEntity<?> deleteSafeZone(String accessToken, Long id) {
        try {
            safeZoneService.deleteSafeZone(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "SafeZone deleted successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(404).body(Map.of("success", false, "error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "error", "Failed to delete safe zone"));
        }
    }
}
