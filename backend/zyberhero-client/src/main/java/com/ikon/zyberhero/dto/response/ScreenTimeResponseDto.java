package com.ikon.zyberhero.dto.response;

import lombok.Data;

@Data
public class ScreenTimeResponseDto {
    private String date;
    private Integer totalScreenTimeSeconds;
    private String totalScreenTimeFormatted;
    private Integer totalFocusedTimeSeconds;
    private String totalFocusedTimeFormatted;
    private Integer totalTimeSeconds;
}
