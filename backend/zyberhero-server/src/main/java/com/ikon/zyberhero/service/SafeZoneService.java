package com.ikon.zyberhero.service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikon.zyberhero.dto.request.SafeZoneCreateRequestDto;
import com.ikon.zyberhero.dto.response.SafeZoneResponseDto;
import com.ikon.zyberhero.entity.SafeZone;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.mapper.SafeZoneMapper;
import com.ikon.zyberhero.repository.SafeZoneRepository;
import com.ikon.zyberhero.repository.DeviceRepository;
import com.ikon.zyberhero.repository.ChildRepository;

@Service
@RequiredArgsConstructor
public class SafeZoneService {

    private final SafeZoneRepository safeZoneRepository;
    private final DeviceRepository deviceRepository;
    private final ChildRepository childRepository;
    private final SafeZoneMapper safeZoneMapper;

    @Transactional
    public Long createSafeZone(SafeZoneCreateRequestDto req) {
        // Validate required fields
        if (req.getName() == null || req.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Missing required field: name");
        }
        if (req.getLatitude() == null) {
            throw new IllegalArgumentException("Missing required field: latitude");
        }
        if (req.getLongitude() == null) {
            throw new IllegalArgumentException("Missing required field: longitude");
        }

        // Resolve childId
        Long resolvedChildId = req.getChildId();
        Long resolvedDeviceId = null;

        // If childId is not provided, try to resolve from device
        if (resolvedChildId == null) {
            if (req.getDeviceId() != null) {
                resolvedDeviceId = req.getDeviceId();
            } else if (req.getDeviceUuid() != null) {
                Device d = deviceRepository.findByDeviceUuid(req.getDeviceUuid())
                    .orElseThrow(() -> new IllegalArgumentException("Device not registered"));
                resolvedDeviceId = d.getId();
            } else {
                throw new IllegalArgumentException("childId or deviceUuid/deviceId required");
            }

            // Get childId from device
            Device device = deviceRepository.findById(resolvedDeviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found"));
            resolvedChildId = device.getChildId().longValue();
        } else {
            // Verify child exists
            if (!childRepository.existsById(resolvedChildId)) {
                throw new IllegalArgumentException("Child not found");
            }

            // If deviceUuid or deviceId is provided, resolve it
            if (req.getDeviceId() != null) {
                resolvedDeviceId = req.getDeviceId();
            } else if (req.getDeviceUuid() != null) {
                Device d = deviceRepository.findByDeviceUuid(req.getDeviceUuid())
                    .orElseThrow(() -> new IllegalArgumentException("Device not registered"));
                resolvedDeviceId = d.getId();
            }
        }

        SafeZone safeZone = safeZoneMapper.mapFromDto(req);
        safeZone.setChildId(resolvedChildId);
        safeZone.setDeviceId(resolvedDeviceId);

        SafeZone saved = safeZoneRepository.save(safeZone);
        return saved.getId();
    }

    @Transactional(readOnly = true)
    public List<SafeZoneResponseDto> listSafeZones(Long childId) {
        List<SafeZone> safeZones;
        if (childId != null) {
            safeZones = safeZoneRepository.findByChildIdOrderByCreatedAtDesc(childId);
        } else {
            safeZones = safeZoneRepository.findAll();
        }
        return safeZones.stream()
            .map(safeZoneMapper::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SafeZoneResponseDto getSafeZone(Long id) {
        SafeZone safeZone = safeZoneRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("SafeZone not found"));
        return safeZoneMapper.mapToDto(safeZone);
    }

    @Transactional
    public void deleteSafeZone(Long id) {
        if (!safeZoneRepository.existsById(id)) {
            throw new IllegalArgumentException("SafeZone not found");
        }
        safeZoneRepository.deleteById(id);
    }
}
