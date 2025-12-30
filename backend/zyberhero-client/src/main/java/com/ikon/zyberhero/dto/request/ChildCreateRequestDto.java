package com.ikon.zyberhero.dto.request;

import lombok.Data;

@Data
public class ChildCreateRequestDto {
    private String name;
    private Integer age;
    private String gender;
    private String dob; // YYYY-MM-DD
    private String phone;
    private Long deviceId; // optional: device to assign
    // private String parentId;
}
