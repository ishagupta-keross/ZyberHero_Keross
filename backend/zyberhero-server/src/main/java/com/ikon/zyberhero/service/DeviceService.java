package com.ikon.zyberhero.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikon.zyberhero.dto.request.DeviceRegisterRequestDto;
import com.ikon.zyberhero.dto.response.DeviceResponseDto;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.mapper.DeviceMapper;
import com.ikon.zyberhero.repository.DeviceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final DeviceMapper deviceMapper;

    @Transactional
    public DeviceResponseDto registerOrUpdate(DeviceRegisterRequestDto req) {
        if (req.getMacAddress() == null || req.getMacAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("macAddress is required");
        }

        Optional<Device> existing = deviceRepository.findFirstByMacAddress(req.getMacAddress());
        Device device;

        if (existing.isPresent()) {
            device = existing.get();
            // prefer existing deviceUuid unless request explicitly provides one
            if (req.getDeviceUuid() != null && !req.getDeviceUuid().isEmpty()) {
                device.setDeviceUuid(req.getDeviceUuid());
            }
            device.setMachineName(req.getMachineName());
            device.setUserName(req.getUserName());
            device.setOs(req.getOs());
            device.setChildId(req.getChildId());
            device.setLastSeen(LocalDateTime.now());
            device = deviceRepository.save(device);
        } else {
            device = deviceMapper.mapFromDto(req);
            if (device.getDeviceUuid() == null || device.getDeviceUuid().isEmpty()) {
                device.setDeviceUuid(java.util.UUID.randomUUID().toString());
            }
            device.setLastSeen(LocalDateTime.now());
            device = deviceRepository.save(device);
        }

        return deviceMapper.mapToDto(device);
    }

    @Transactional(readOnly = true)
    public DeviceResponseDto findUuidByMac(String macAddress) {
        Optional<Device> d = deviceRepository.findFirstByMacAddress(macAddress);
        if (d.isEmpty()) return null;
        return deviceMapper.mapToDto(d.get());
    }

    @Transactional(readOnly = true)
    public List<Device> listAll() {
        return deviceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Device> listUnassigned() {
        return deviceRepository.findAll().stream().filter(d -> d.getChildId() == null).toList();
    }

    @Transactional(readOnly = true)
    public Optional<Device> findByUuid(String deviceUuid) {
        return deviceRepository.findByDeviceUuid(deviceUuid);
    }
}
