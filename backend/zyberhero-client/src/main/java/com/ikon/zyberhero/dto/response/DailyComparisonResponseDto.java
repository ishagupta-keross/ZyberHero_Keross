package com.ikon.zyberhero.dto.response;

import java.util.List;
import lombok.Data;

@Data
public class DailyComparisonResponseDto {
    private String date;
    private List<AppSummaryDto> apps;
    private SummaryTotals summary;

    @Data
    public static class AppSummaryDto {
        private String app;
        private String windowTitle;
        private Integer focusedTimeSeconds;
        private Integer screenTimeSeconds;
        private String focusedTimeFormatted;
        private String screenTimeFormatted;
        private Integer totalTimeSeconds;
    }

    @Data
    public static class SummaryTotals {
        private Integer totalFocusedSeconds;
        private Integer totalScreenSeconds;
    }
}
