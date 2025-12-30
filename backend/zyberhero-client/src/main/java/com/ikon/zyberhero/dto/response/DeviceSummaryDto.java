package com.ikon.zyberhero.dto.response;

import lombok.Data;

@Data
public class DeviceSummaryDto {
    private Long id;
    private String deviceUuid;
    private String machineName;
    private String userName;
    private String macAddress;
}
