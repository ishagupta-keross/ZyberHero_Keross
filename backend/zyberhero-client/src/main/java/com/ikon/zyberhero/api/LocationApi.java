package com.ikon.zyberhero.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.LocationCreateRequestDto;
import com.ikon.zyberhero.dto.response.LocationResponseDto;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Location APIs", description = "Device location endpoints")
@RequestMapping("/api")
public interface LocationApi {

    @PostMapping("/location")
    ResponseEntity<?> createLocation(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                     @RequestBody LocationCreateRequestDto request);

    @GetMapping("/location/latest")
    ResponseEntity<LocationResponseDto> latest(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                              @RequestParam(value = "deviceUuid", required = false) String deviceUuid,
                                              @RequestParam(value = "deviceId", required = false) Long deviceId);



    @GetMapping("/location/history")
    ResponseEntity<List<LocationResponseDto>> history(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                                     @RequestParam(value = "deviceUuid", required = false) String deviceUuid,
                                                     @RequestParam(value = "deviceId", required = false) Long deviceId,
                                                     @RequestParam(value = "date", required = false) String date,
                                                     @RequestParam(value = "limit", required = false) Integer limit);

}