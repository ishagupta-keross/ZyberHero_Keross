package com.ikon.zyberhero.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikon.zyberhero.dto.request.AlertCreateRequestDto;
import com.ikon.zyberhero.dto.response.AlertResponseDto;
import com.ikon.zyberhero.entity.Alert;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.mapper.AlertMapper;
import com.ikon.zyberhero.repository.AlertRepository;
import com.ikon.zyberhero.repository.DeviceRepository;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final DeviceRepository deviceRepository;
    private final AlertMapper alertMapper;

    @Transactional
    public Long createAlert(AlertCreateRequestDto req) throws Exception {
        if (req.getType() == null || req.getType().trim().isEmpty()) {
            throw new IllegalArgumentException("Missing required field: type");
        }

        Long resolvedDeviceId = null;
        if (req.getDeviceId() != null) resolvedDeviceId = req.getDeviceId();
        else if (req.getDeviceUuid() != null) {
            Device d = deviceRepository.findByDeviceUuid(req.getDeviceUuid()).orElseThrow(() -> new IllegalArgumentException("Device not registered"));
            resolvedDeviceId = d.getId();
        } else {
            throw new IllegalArgumentException("deviceUuid or deviceId required");
        }

        Alert a = alertMapper.mapFromDto(req);
        a.setDeviceId(resolvedDeviceId);
        Alert saved = alertRepository.save(a);
        return saved.getId();
    }

    @Transactional(readOnly = true)
    public Optional<AlertResponseDto> latestForDevice(Long deviceId) {
        return alertRepository.findFirstByDeviceIdOrderByIdDesc(deviceId).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public List<AlertResponseDto> listForDevice(Long deviceId, int limit) {
        return alertRepository.findByDeviceIdOrderByIdDesc(deviceId, PageRequest.of(0, limit))
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countLast24h() {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        return alertRepository.countByTimestampGreaterThanEqual(since);
    }

    private AlertResponseDto toDto(Alert a) {
        return alertMapper.mapToDto(a);
    }

}
