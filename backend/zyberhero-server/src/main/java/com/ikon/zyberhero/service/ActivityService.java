package com.ikon.zyberhero.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikon.zyberhero.dto.request.ActivityCreateRequestDto;
import com.ikon.zyberhero.dto.response.ActivityResponseDto;
import com.ikon.zyberhero.entity.ActivityLog;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.mapper.ActivityMapper;
import com.ikon.zyberhero.repository.ActivityLogRepository;
import com.ikon.zyberhero.repository.DeviceRepository;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityLogRepository activityLogRepository;
    private final DeviceRepository deviceRepository;
    private final ActivityMapper activityMapper;

    @Transactional
    public Long createActivity(ActivityCreateRequestDto req) {
        if (req.getAppName() == null || req.getAppName().trim().isEmpty()) {
            throw new IllegalArgumentException("Missing required field: appName");
        }

        Long resolvedDeviceId = null;
        if (req.getDeviceId() != null) resolvedDeviceId = req.getDeviceId();
        else if (req.getDeviceUuid() != null) {
            Device d = deviceRepository.findByDeviceUuid(req.getDeviceUuid()).orElseThrow(() -> new IllegalArgumentException("Device not registered"));
            resolvedDeviceId = d.getId();
        } else {
            throw new IllegalArgumentException("deviceUuid or deviceId required");
        }

    ActivityLog log = activityMapper.mapFromDto(req);
    log.setDeviceId(resolvedDeviceId);
    ActivityLog saved = activityLogRepository.save(log);

        // update device lastSeen
        deviceRepository.findById(resolvedDeviceId).ifPresent(d -> {
            d.setLastSeen(LocalDateTime.now());
            deviceRepository.save(d);
        });

        return saved.getId();
    }

    @Transactional(readOnly = true)
    public List<ActivityResponseDto> listRecent() {
        var page = activityLogRepository.findAll(PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "timestamp")));
        return page.stream().map(activityMapper::mapToDto).collect(Collectors.toList());
    }

}
