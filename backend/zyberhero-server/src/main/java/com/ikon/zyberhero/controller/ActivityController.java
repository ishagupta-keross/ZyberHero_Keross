package com.ikon.zyberhero.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.ikon.zyberhero.api.ActivityApi;
import com.ikon.zyberhero.dto.request.ActivityCreateRequestDto;
import com.ikon.zyberhero.dto.response.ActivityResponseDto;
import com.ikon.zyberhero.service.ActivityService;

@RestController
@RequiredArgsConstructor
public class ActivityController implements ActivityApi {

    private final ActivityService activityService;

    @Override
    public ResponseEntity<?> createActivity(String accessToken, ActivityCreateRequestDto request) {
        try {
            Long id = activityService.createActivity(request);
            return ResponseEntity.created(URI.create("/api/activity/" + id)).body(Map.of("id", id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to save activity"));
        }
    }

    @Override
    public ResponseEntity<List<ActivityResponseDto>> listActivity(String accessToken) {
        List<ActivityResponseDto> list = activityService.listRecent();
        return ResponseEntity.ok(list);
    }

}
