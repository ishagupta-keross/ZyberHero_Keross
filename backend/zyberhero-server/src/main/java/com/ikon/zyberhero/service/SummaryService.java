package com.ikon.zyberhero.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikon.zyberhero.dto.response.DailyComparisonResponseDto;
import com.ikon.zyberhero.dto.response.ScreenTimeResponseDto;
import com.ikon.zyberhero.entity.ActivityLog;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.repository.ActivityLogRepository;
import com.ikon.zyberhero.repository.DeviceRepository;

@Service
@RequiredArgsConstructor
public class SummaryService {

    private final ActivityLogRepository activityLogRepository;
    private final DeviceRepository deviceRepository;

    private static class AppTimes { int focused = 0; int screen = 0; String latestWindowTitle = null; }

    private LocalDateTime startOfDay(String date) {
        if (date == null) {
            LocalDate now = LocalDate.now();
            return now.atStartOfDay();
        }
        LocalDate d = LocalDate.parse(date);
        return d.atStartOfDay();
    }

    @Transactional(readOnly = true)
    public DailyComparisonResponseDto dailyComparison(String date, String deviceUuid, Long deviceId, Long childId) {
        LocalDateTime start = startOfDay(date);
        LocalDateTime end = start.plusDays(1);

        List<Long> deviceIds = resolveDeviceIds(deviceUuid, deviceId, childId);

        List<ActivityLog> logs;
        if (deviceIds.isEmpty()) {
            logs = activityLogRepository.findByTimestampBetweenAndDurationSecondsGreaterThan(start, end, 0);
        } else {
            logs = activityLogRepository.findByTimestampBetweenAndDeviceIdInAndDurationSecondsGreaterThan(start, end, deviceIds, 0);
        }

        Map<String, AppTimes> appMap = new HashMap<>();

        for (ActivityLog log : logs) {
            String app = log.getAppName() == null ? "unknown" : log.getAppName();
            String title = log.getWindowTitle() == null ? "" : log.getWindowTitle();

            if (app.equals("chrome")) {
                String t = title.toLowerCase();
                if (t.contains("google chat") || t.contains("chat.google.com")) app = "google-chat";
                else if (t.contains("whatsapp")) app = "whatsapp";
                else if (t.contains("youtube")) app = "youtube";
                else if (t.contains("gmail")) app = "gmail";
                else if (t.contains("netflix")) app = "netflix";
                else app = "chrome";
            } else if (app.equals("msedge")) {
                String t = title.toLowerCase();
                if (t.contains("youtube")) app = "youtube-edge";
                else if (t.contains("netflix")) app = "netflix-edge";
                else app = "msedge";
            }

            AppTimes at = appMap.computeIfAbsent(app, k -> new AppTimes());
            int duration = log.getDurationSeconds() == null ? 0 : log.getDurationSeconds();
            if (Boolean.TRUE.equals(log.getScreenTime())) at.screen += duration; else at.focused += duration;
            if (at.latestWindowTitle == null || at.latestWindowTitle.equals(app)) at.latestWindowTitle = log.getWindowTitle();
        }

        List<DailyComparisonResponseDto.AppSummaryDto> apps = appMap.entrySet().stream().map(e -> {
            DailyComparisonResponseDto.AppSummaryDto dto = new DailyComparisonResponseDto.AppSummaryDto();
            dto.setApp(e.getKey());
            dto.setWindowTitle(e.getValue().latestWindowTitle);
            dto.setFocusedTimeSeconds(e.getValue().focused);
            dto.setScreenTimeSeconds(e.getValue().screen);
            dto.setFocusedTimeFormatted(formatDuration(e.getValue().focused));
            dto.setScreenTimeFormatted(formatDuration(e.getValue().screen));
            dto.setTotalTimeSeconds(e.getValue().focused + e.getValue().screen);
            return dto;
        }).sorted((a,b)->Integer.compare(b.getTotalTimeSeconds(), a.getTotalTimeSeconds())).collect(Collectors.toList());

        DailyComparisonResponseDto res = new DailyComparisonResponseDto();
        res.setDate(start.toLocalDate().toString());
        res.setApps(apps);
        DailyComparisonResponseDto.SummaryTotals totals = new DailyComparisonResponseDto.SummaryTotals();
        totals.setTotalFocusedSeconds(apps.stream().mapToInt(a->a.getFocusedTimeSeconds()==null?0:a.getFocusedTimeSeconds()).sum());
        totals.setTotalScreenSeconds(apps.stream().mapToInt(a->a.getScreenTimeSeconds()==null?0:a.getScreenTimeSeconds()).sum());
        res.setSummary(totals);
        return res;
    }

    @Transactional(readOnly = true)
    public ScreenTimeResponseDto screenTimeTotal(String date, String deviceUuid, Long deviceId, Long childId) {
        LocalDateTime start = startOfDay(date);
        LocalDateTime end = start.plusDays(1);

        List<Long> deviceIds = resolveDeviceIds(deviceUuid, deviceId, childId);

        int size = deviceIds.size();
        Long screenSum = deviceIds.isEmpty() ? activityLogRepository.sumDurationBetweenForDevice(start, end, true, null) : activityLogRepository.sumDurationBetweenForDevices(start, end, true, deviceIds, size);
        Long focusedSum = deviceIds.isEmpty() ? activityLogRepository.sumDurationBetweenForDevice(start, end, false, null) : activityLogRepository.sumDurationBetweenForDevices(start, end, false, deviceIds, size);

        int totalScreen = screenSum == null ? 0 : screenSum.intValue();
        int totalFocused = focusedSum == null ? 0 : focusedSum.intValue();

        ScreenTimeResponseDto r = new ScreenTimeResponseDto();
        r.setDate(start.toLocalDate().toString());
        r.setTotalScreenTimeSeconds(totalScreen);
        r.setTotalScreenTimeFormatted(formatDuration(totalScreen));
        r.setTotalFocusedTimeSeconds(totalFocused);
        r.setTotalFocusedTimeFormatted(formatDuration(totalFocused));
        r.setTotalTimeSeconds(totalScreen + totalFocused);
        return r;
    }

    private List<Long> resolveDeviceIds(String deviceUuid, Long deviceId, Long childId) {
        if (deviceId != null) return List.of(deviceId);
        if (deviceUuid != null) {
            return deviceRepository.findByDeviceUuid(deviceUuid).map(d -> List.of(d.getId())).orElse(new ArrayList<>());
        }
        if (childId != null) {
            return deviceRepository.findByChildId(childId.intValue()).stream().map(Device::getId).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    private String formatDuration(int seconds) {
        if (seconds <= 0) return "0s";
        if (seconds < 60) return seconds + "s";
        int h = seconds / 3600;
        int m = (seconds % 3600) / 60;
        if (h > 0) return h + "h " + m + "m";
        return m + "m";
    }

}
