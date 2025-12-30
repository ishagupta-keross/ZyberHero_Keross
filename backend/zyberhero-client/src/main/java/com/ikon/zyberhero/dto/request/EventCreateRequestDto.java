package com.ikon.zyberhero.dto.request;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventCreateRequestDto {
    private String title;
    private String color;
    private UUID sourceIdentifier;
    private List<String> assignedMembers;
    private String meetingLink;
    private String startDate;
    private String endDate;
    private String guestEmail ;
    private String startTime;
    private String endTime;
    private String repeat;
    private String reminder;
    private String description;
    private String source;
}
