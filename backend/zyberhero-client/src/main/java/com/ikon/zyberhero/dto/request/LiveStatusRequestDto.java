package com.ikon.zyberhero.dto.request;

import java.util.List;
import lombok.Data;

@Data
public class LiveStatusRequestDto {
    private String deviceUuid;
    private Long deviceId;
    private String machineName;
    private List<LiveAppDto> apps;

    @Data
    public static class LiveAppDto {
        private String appName;
        private String windowTitle;
    }
}
