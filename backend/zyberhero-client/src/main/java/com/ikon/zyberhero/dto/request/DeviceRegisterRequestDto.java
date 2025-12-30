package com.ikon.zyberhero.dto.request;

import lombok.Data;

@Data
public class DeviceRegisterRequestDto {
    private String deviceUuid;
    private String macAddress;
    private String machineName;
    private String userName;
    private String os;
    private Integer childId;
}
