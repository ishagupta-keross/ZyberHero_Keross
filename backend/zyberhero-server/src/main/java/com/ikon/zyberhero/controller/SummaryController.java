package com.ikon.zyberhero.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.ikon.zyberhero.api.SummaryApi;
import com.ikon.zyberhero.dto.response.DailyComparisonResponseDto;
import com.ikon.zyberhero.dto.response.ScreenTimeResponseDto;
import com.ikon.zyberhero.service.SummaryService;

@RestController
@RequiredArgsConstructor
public class SummaryController implements SummaryApi {

    private final SummaryService summaryService;

    @Override
    public ResponseEntity<DailyComparisonResponseDto> dailyComparison(String accessToken, String date, String deviceUuid, Long deviceId, Long childId) {
        try {
            var dto = summaryService.dailyComparison(date, deviceUuid, deviceId, childId);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<ScreenTimeResponseDto> screenTimeTotal(String accessToken, String date, String deviceUuid, Long deviceId, Long childId) {
        try {
            var dto = summaryService.screenTimeTotal(date, deviceUuid, deviceId, childId);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

}
