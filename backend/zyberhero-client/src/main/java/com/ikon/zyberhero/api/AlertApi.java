package com.ikon.zyberhero.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.AlertCreateRequestDto;
import com.ikon.zyberhero.dto.response.AlertResponseDto;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Alert APIs", description = "Alert ingestion and listing")
@RequestMapping("/api/alerts")
public interface AlertApi {

    @PostMapping
    ResponseEntity<?> createAlert(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                  @RequestBody AlertCreateRequestDto request);

    @GetMapping("/latest")
    ResponseEntity<AlertResponseDto> latest(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                            @RequestParam(value = "deviceUuid", required = false) String deviceUuid,
                                            @RequestParam(value = "deviceId", required = false) Long deviceId);

    @GetMapping("/list")
    ResponseEntity<List<AlertResponseDto>> list(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                                @RequestParam(value = "deviceUuid", required = false) String deviceUuid,
                                                @RequestParam(value = "deviceId", required = false) Long deviceId);

    @GetMapping("/count-last-24h")
    ResponseEntity<?> countLast24h(@RequestHeader(value = "Authorization", required = false) String accessToken);

}
