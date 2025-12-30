package com.ikon.zyberhero.mapper;

import java.time.ZoneId;

import org.springframework.stereotype.Component;

import com.ikon.zyberhero.dto.request.LiveStatusRequestDto;
import com.ikon.zyberhero.dto.response.LiveAppResponseDto;
import com.ikon.zyberhero.entity.LiveAppStatus;

@Component
public class LiveStatusMapper {

    public LiveAppStatus mapFromDto(LiveStatusRequestDto.LiveAppDto app) {
        if (app == null) return null;
        LiveAppStatus s = new LiveAppStatus();
        s.setAppName(app.getAppName());
        s.setWindowTitle(app.getWindowTitle());
        s.setIsRunning(true);
        s.setLastSeen(java.time.LocalDateTime.now());
        return s;
    }

    public LiveAppResponseDto mapToDto(LiveAppStatus s) {
        if (s == null) return null;
        LiveAppResponseDto d = new LiveAppResponseDto();
        d.setAppName(s.getAppName());
        d.setWindowTitle(s.getWindowTitle());
    d.setLastSeen(s.getLastSeen() == null ? null : s.getLastSeen().atZone(ZoneId.systemDefault()).toInstant());
        return d;
    }

}
