package com.ikon.zyberhero.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikon.zyberhero.dto.request.LocationCreateRequestDto;
import com.ikon.zyberhero.dto.response.LocationResponseDto;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.entity.Location;
import com.ikon.zyberhero.repository.DeviceRepository;
import com.ikon.zyberhero.repository.LocationRepository;

@Service
public class LocationService {

    private final DeviceRepository deviceRepository;
    private final LocationRepository locationRepository;

    public LocationService(DeviceRepository deviceRepository, LocationRepository locationRepository) {
        this.deviceRepository = deviceRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional
    public LocationResponseDto createLocation(LocationCreateRequestDto req) {
        Device device = null;
        if (req.getDeviceMac() != null) {
            device = deviceRepository.findFirstByMacAddress(req.getDeviceMac()).orElse(null);
        }
        if (device == null && req.getDeviceId() != null) {
            device = deviceRepository.findById(req.getDeviceId()).orElse(null);
        }
        if (device == null) throw new IllegalArgumentException("Device not found");

        Location loc = new Location();
        if (req.getTimestamp() != null) {
            loc.setTimestamp(LocalDateTime.ofInstant(req.getTimestamp(), ZoneId.systemDefault()));
        } else {
            loc.setTimestamp(LocalDateTime.now());
        }
        loc.setLatitude(req.getLatitude());
        loc.setLongitude(req.getLongitude());
        loc.setAccuracy(req.getAccuracy());
        loc.setAltitude(req.getAltitude());
        loc.setDeviceId(device.getId());

        loc = locationRepository.save(loc);

        device.setLastSeen(LocalDateTime.now());
        deviceRepository.save(device);

        return toDto(loc);
    }

    public LocationResponseDto latest(String deviceUuid, Long deviceId) {
        Device device = resolveDevice(deviceUuid, deviceId);
        if (device == null) return null;
        return locationRepository.findFirstByDeviceIdOrderByTimestampDesc(device.getId()).map(this::toDto).orElse(null);
    }

    public LocationResponseDto deviceLocationByUuid(String deviceUuid) {
        Device device = deviceRepository.findByDeviceUuid(deviceUuid).orElse(null);
        if (device == null) return null;
        return locationRepository.findFirstByDeviceIdOrderByTimestampDesc(device.getId()).map(this::toDto).orElse(null);
    }

    public List<LocationResponseDto> history(String deviceUuid, Long deviceId, String date, Integer limit) {
        Device device = resolveDevice(deviceUuid, deviceId);
        if (device == null) return new ArrayList<>();
        if (date != null) {
            LocalDate d = LocalDate.parse(date);
            LocalDateTime start = LocalDateTime.of(d, LocalTime.MIN);
            LocalDateTime end = LocalDateTime.of(d, LocalTime.MAX);
            List<Location> list = locationRepository.findByDeviceIdAndTimestampBetweenOrderByTimestampDesc(device.getId(), start, end);
            List<LocationResponseDto> out = new ArrayList<>();
            for (Location l : list) out.add(toDto(l));
            if (limit != null && out.size() > limit) return out.subList(0, limit);
            return out;
        } else {
            List<Location> list = locationRepository.findByDeviceIdOrderByTimestampDesc(device.getId());
            List<LocationResponseDto> out = new ArrayList<>();
            for (Location l : list) out.add(toDto(l));
            if (limit != null && out.size() > limit) return out.subList(0, limit);
            return out;
        }
    }

    private Device resolveDevice(String deviceUuid, Long deviceId) {
        Device device = null;
        if (deviceUuid != null) {
            device = deviceRepository.findByDeviceUuid(deviceUuid).orElse(null);
        }
        if (device == null && deviceId != null) {
            device = deviceRepository.findById(deviceId).orElse(null);
        }
        return device;
    }

    private LocationResponseDto toDto(Location l) {
        LocationResponseDto d = new LocationResponseDto();
        d.setId(l.getId());
        d.setLatitude(l.getLatitude());
        d.setLongitude(l.getLongitude());
        d.setAccuracy(l.getAccuracy());
        d.setAltitude(l.getAltitude());
        d.setTimestamp(l.getTimestamp() == null ? null : l.getTimestamp().atZone(ZoneId.systemDefault()).toInstant());
        d.setDeviceId(l.getDeviceId());
        return d;
    }

}
