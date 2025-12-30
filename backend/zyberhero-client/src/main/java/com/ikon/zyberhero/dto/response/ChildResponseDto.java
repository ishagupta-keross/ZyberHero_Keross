package com.ikon.zyberhero.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class ChildResponseDto {
    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private String dob;
    private String phone;
    private String createdAt;
    private List<DeviceSummaryDto> devices;
}
