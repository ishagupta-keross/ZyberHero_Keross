package com.ikon.zyberhero.dto.response;

import lombok.Data;

@Data
public class CommandResponseDto {
    private Long id;
    private String appName;
    private String action;
    private String schedule;
}
