package com.ikon.zyberhero.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventResponseDto {
    private UUID accountId;
    private UUID id;
    private UUID sourceIdentifier;
    private String title;
    private String color;
    private List<String> assignedMembers;
    private String meetingLink;
    private String startDate;
    private String endDate;
    private String guestEmail;
    private String startTime;
    private String endTime;
    private String repeat;
    private String reminder;
    private String description;
    private String createdBy;
    private String createdAt;
    private String source;
}
