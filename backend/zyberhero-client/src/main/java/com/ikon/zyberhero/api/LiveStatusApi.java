package com.ikon.zyberhero.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.LiveStatusRequestDto;
import com.ikon.zyberhero.dto.response.LiveAppResponseDto;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Live Status APIs", description = "Live app status endpoints")
@RequestMapping("/api")
public interface LiveStatusApi {

    @PostMapping("/live-status")
    ResponseEntity<?> postLiveStatus(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                     @RequestBody LiveStatusRequestDto request);

    @GetMapping("/live-status")
    ResponseEntity<List<LiveAppResponseDto>> getLiveStatus(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                                           @RequestParam(value = "deviceUuid", required = false) String deviceUuid,
                                                           @RequestParam(value = "deviceId", required = false) Long deviceId,
                                                           @RequestParam(value = "staleSeconds", required = false) Integer staleSeconds);

}
