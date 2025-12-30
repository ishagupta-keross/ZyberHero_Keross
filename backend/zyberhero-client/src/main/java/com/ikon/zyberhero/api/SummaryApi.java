package com.ikon.zyberhero.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.ikon.zyberhero.dto.response.ScreenTimeResponseDto;
import com.ikon.zyberhero.dto.response.DailyComparisonResponseDto;

@Tag(name = "Summary APIs", description = "Summary and screen-time endpoints")
@RequestMapping("/api")
public interface SummaryApi {

    @GetMapping("/summary/daily-comparison")
    ResponseEntity<DailyComparisonResponseDto> dailyComparison(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                                                 @RequestParam(value = "date", required = false) String date,
                                                                 @RequestParam(value = "deviceUuid", required = false) String deviceUuid,
                                                                 @RequestParam(value = "deviceId", required = false) Long deviceId,
                                                                 @RequestParam(value = "childId", required = false) Long childId);

    @GetMapping("/screen-time/total")
    ResponseEntity<ScreenTimeResponseDto> screenTimeTotal(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                                          @RequestParam(value = "date", required = false) String date,
                                                          @RequestParam(value = "deviceUuid", required = false) String deviceUuid,
                                                          @RequestParam(value = "deviceId", required = false) Long deviceId,
                                                          @RequestParam(value = "childId", required = false) Long childId);

}
