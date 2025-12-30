package com.ikon.zyberhero.service;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikon.zyberhero.dto.request.LiveStatusRequestDto;
import com.ikon.zyberhero.dto.response.LiveAppResponseDto;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.entity.LiveAppStatus;
import com.ikon.zyberhero.mapper.LiveStatusMapper;
import com.ikon.zyberhero.repository.DeviceRepository;
import com.ikon.zyberhero.repository.LiveAppStatusRepository;

@Service
public class LiveStatusService {

    private static final Logger log = LoggerFactory.getLogger(LiveStatusService.class);

    private final DeviceRepository deviceRepository;
    private final LiveAppStatusRepository liveAppStatusRepository;
    private final LiveStatusMapper mapper;

    public LiveStatusService(DeviceRepository deviceRepository,
            LiveAppStatusRepository liveAppStatusRepository, LiveStatusMapper mapper) {
        this.deviceRepository = deviceRepository;
        this.liveAppStatusRepository = liveAppStatusRepository;
        this.mapper = mapper;
    }

    @Transactional
    public List<LiveAppResponseDto> upsertLiveStatus(LiveStatusRequestDto req) {
        // resolve device: prefer deviceUuid, then deviceId, then mac
        Device device = null;
        if (req.getDeviceUuid() != null) {
            device = deviceRepository.findByDeviceUuid(req.getDeviceUuid()).orElse(null);
        }
        if (device == null && req.getDeviceId() != null) {
            device = deviceRepository.findById(req.getDeviceId()).orElse(null);
        }
        if (device == null && req.getMachineName() != null) {
            device = deviceRepository.findFirstByMachineName(req.getMachineName()).orElse(null);
        }
        if (device == null) {
            log.warn("LiveStatus upsert: device not found for request: {}", req);
            throw new IllegalArgumentException("Device not found");
        }

        log.debug("LiveStatus upsert: resolved device id={} uuid={}", device.getId(), device.getDeviceUuid());

        // mark existing apps for device as not running
        java.util.List<LiveAppStatus> running = liveAppStatusRepository.findByDeviceIdAndIsRunningTrue(device.getId());
        if (running != null && !running.isEmpty()) {
            for (LiveAppStatus r : running) {
                r.setIsRunning(false);
            }
            liveAppStatusRepository.saveAll(running);
        }

        List<LiveAppResponseDto> out = new ArrayList<>();
        if (req.getApps() != null) {
            for (LiveStatusRequestDto.LiveAppDto a : req.getApps()) {
                LiveAppStatus e = mapper.mapFromDto(a);
                e.setDeviceId(device.getId());
                // try to find existing by device+appName
                LiveAppStatus existing = liveAppStatusRepository.findFirstByDeviceIdAndAppName(device.getId(), e.getAppName()).orElse(null);
                if (existing != null) {
                    existing.setIsRunning(true);
                    existing.setWindowTitle(e.getWindowTitle());
                    existing.setLastSeen(e.getLastSeen());
                    e = liveAppStatusRepository.save(existing);
                } else {
                    e = liveAppStatusRepository.save(e);
                }
                out.add(mapper.mapToDto(e));
            }
        }

        // log how many running apps now exist for device
        List<LiveAppStatus> nowRunning = liveAppStatusRepository.findByDeviceIdAndIsRunningTrue(device.getId());
        log.debug("LiveStatus upsert: after save running apps count={} for deviceId={}", nowRunning.size(), device.getId());

        // update device last seen
        device.setLastSeen(java.time.LocalDateTime.now());
        deviceRepository.save(device);

        return out;
    }

    public List<LiveAppResponseDto> getRunningAppsForDevice(Long deviceId) {
        List<LiveAppStatus> apps = liveAppStatusRepository.findByDeviceIdAndIsRunningTrue(deviceId);
        List<LiveAppResponseDto> out = new ArrayList<>();
        for (LiveAppStatus s : apps) out.add(mapper.mapToDto(s));
        return out;
    }

    public List<LiveAppResponseDto> getRunningApps(String deviceUuid, Long deviceId, Integer staleSeconds) {
        com.ikon.zyberhero.entity.Device device = null;
        if (deviceUuid != null) {
            device = deviceRepository.findByDeviceUuid(deviceUuid).orElse(null);
        }
        if (device == null && deviceId != null) {
            device = deviceRepository.findById(deviceId).orElse(null);
        }
        if (device == null) return new ArrayList<>();

        if (staleSeconds != null && staleSeconds > 0) {
            java.time.LocalDateTime cutoff = java.time.LocalDateTime.now().minusSeconds(staleSeconds);
            List<LiveAppStatus> apps = liveAppStatusRepository.findByDeviceIdAndIsRunningTrueAndLastSeenGreaterThanEqual(device.getId(), cutoff);
            List<LiveAppResponseDto> out = new ArrayList<>();
            for (LiveAppStatus s : apps) out.add(mapper.mapToDto(s));
            return out;
        }

        return getRunningAppsForDevice(device.getId());
    }

}