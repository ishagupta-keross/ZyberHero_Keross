package com.ikon.zyberhero.controller;

import java.net.URI;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.api.DeviceApi;
import com.ikon.zyberhero.dto.request.DeviceRegisterRequestDto;
import com.ikon.zyberhero.dto.response.DeviceResponseDto;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.service.DeviceService;

@RestController
@RequiredArgsConstructor
public class DeviceController implements DeviceApi {

    private final DeviceService deviceService;

    @Override
    public ResponseEntity<DeviceResponseDto> registerDevice(String accessToken, DeviceRegisterRequestDto request) {
        DeviceResponseDto resp = deviceService.registerOrUpdate(request);
        return ResponseEntity.created(URI.create("/api/devices/" + resp.getDeviceId())).body(resp);
    }

    @Override
    public ResponseEntity<?> updateDevice(String accessToken, DeviceRegisterRequestDto request) {
        // reuse same logic as register for now
        deviceService.registerOrUpdate(request);
        return ResponseEntity.ok().body(java.util.Map.of("success", true));
    }

    @Override
    public ResponseEntity<?> listDevices(String accessToken) {
        List<Device> devices = deviceService.listAll();
        return ResponseEntity.ok(devices);
    }

    @Override
    public ResponseEntity<?> getUuidByMac(String accessToken, String macAddress) {
        if (macAddress == null || macAddress.trim().isEmpty()) return ResponseEntity.badRequest().body(java.util.Map.of("error","macAddress required"));
        DeviceResponseDto r = deviceService.findUuidByMac(macAddress.trim());
        if (r == null) return ResponseEntity.status(404).body(java.util.Map.of("error","Device not found"));
        return ResponseEntity.ok(r);
    }

    @Override
    public ResponseEntity<?> getUnassignedDevices(String accessToken) {
        List<Device> devices = deviceService.listUnassigned();
        return ResponseEntity.ok(java.util.Map.of("devices", devices));
    }

    @Override
    public ResponseEntity<?> getDeviceLocation(String accessToken, String deviceUuid) {
        // location service not implemented yet — return device basic info or 404
        var d = deviceService.findByUuid(deviceUuid);
        if (d.isEmpty()) return ResponseEntity.status(404).body(java.util.Map.of("error","Device not found"));
        return ResponseEntity.ok(java.util.Map.of("deviceId", d.get().getId()));
    }
}
