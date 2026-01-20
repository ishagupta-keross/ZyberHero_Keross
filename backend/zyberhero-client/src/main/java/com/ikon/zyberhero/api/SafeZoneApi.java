package com.ikon.zyberhero.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.SafeZoneCreateRequestDto;
import com.ikon.zyberhero.dto.response.SafeZoneResponseDto;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "SafeZone APIs", description = "SafeZone creation and listing")
@RequestMapping("/api")
public interface SafeZoneApi {

    @PostMapping("/safezones")
    ResponseEntity<?> createSafeZone(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                     @RequestBody SafeZoneCreateRequestDto request);

    @GetMapping("/safezones")
    ResponseEntity<List<SafeZoneResponseDto>> listSafeZones(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                                             @RequestParam(required = false) Long childId);

    @GetMapping("/safezones/{id}")
    ResponseEntity<?> getSafeZone(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                   @PathVariable Long id);

    @DeleteMapping("/safezones/{id}")
    ResponseEntity<?> deleteSafeZone(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                      @PathVariable Long id);
}
