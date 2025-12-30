package com.ikon.zyberhero.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.DeviceRegisterRequestDto;
import com.ikon.zyberhero.dto.response.DeviceResponseDto;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Device APIs", description = "Device related APIs")
@RequestMapping("/api/devices")
public interface DeviceApi {

    @PostMapping("/register")
    ResponseEntity<DeviceResponseDto> registerDevice(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                                      @RequestBody DeviceRegisterRequestDto request);

    @PostMapping("/update")
    ResponseEntity<?> updateDevice(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                   @RequestBody DeviceRegisterRequestDto request);

    @GetMapping
    ResponseEntity<?> listDevices(@RequestHeader(value = "Authorization", required = false) String accessToken);

    @GetMapping("/uuid-by-mac")
    ResponseEntity<?> getUuidByMac(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                   @RequestParam("macAddress") String macAddress);

    @GetMapping("/unassigned")
    ResponseEntity<?> getUnassignedDevices(@RequestHeader(value = "Authorization", required = false) String accessToken);

    @GetMapping("/{deviceUuid}/location")
    ResponseEntity<?> getDeviceLocation(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                        @PathVariable("deviceUuid") String deviceUuid);
}
