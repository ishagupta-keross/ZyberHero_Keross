package com.ikon.zyberhero.mapper;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

import org.springframework.stereotype.Component;

import com.ikon.zyberhero.dto.request.ActivityCreateRequestDto;
import com.ikon.zyberhero.dto.response.ActivityResponseDto;
import com.ikon.zyberhero.entity.ActivityLog;

@Component
public class ActivityMapper {

    public ActivityLog mapFromDto(ActivityCreateRequestDto req) {
        if (req == null) return null;
        ActivityLog log = new ActivityLog();
        // Store `timestamp` as UTC-based LocalDateTime (server canonical time).
        log.setTimestamp(req.getTimestamp() != null ? LocalDateTime.ofInstant(req.getTimestamp(), ZoneOffset.UTC) : LocalDateTime.now());

   
        log.setLocalTimestamp(req.getLocalTimestamp() != null ? LocalDateTime.ofInstant(req.getLocalTimestamp(), ZoneId.systemDefault()) : null);
        log.setAppName(req.getAppName());
        log.setWindowTitle(req.getWindowTitle() == null ? "" : req.getWindowTitle());
        log.setDurationSeconds(req.getDurationSeconds() == null ? 0 : req.getDurationSeconds());
        log.setExecutablePath(req.getExecutablePath() == null ? "" : req.getExecutablePath());
        log.setScreenTime(req.getScreenTime() == null ? false : req.getScreenTime());
        // deviceId should be set by the service after resolution
        return log;
    }

    public ActivityResponseDto mapToDto(ActivityLog l) {
        if (l == null) return null;
        ActivityResponseDto d = new ActivityResponseDto();
        d.setId(l.getId());
        d.setTimestamp(l.getTimestamp() == null ? null : l.getTimestamp().atZone(ZoneId.systemDefault()).toInstant());
        d.setLocalTimestamp(l.getLocalTimestamp() == null ? null : l.getLocalTimestamp().atZone(ZoneId.systemDefault()).toInstant());
        d.setAppName(l.getAppName());
        d.setWindowTitle(l.getWindowTitle());
        d.setDurationSeconds(l.getDurationSeconds());
        d.setExecutablePath(l.getExecutablePath());
        d.setScreenTime(l.getScreenTime());
        d.setDeviceId(l.getDeviceId());
        return d;
    }

}
