package com.ikon.zyberhero.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private UUID accountId;

    private UUID sourceIdentifier;

    private String title;

    private String color;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_assigned_members", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "member_name")
    private List<String> assignedMembers;

    private String meetingLink;

    private String startDate;

    private String endDate;

    private String guestEmail;

    private String startTime;

    private String endTime;

    @Column(name = "repeat_value")
    private String repeat;

    @Column(name = "reminder_value")
    private String reminder;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, updatable = false)
    private String createdBy;

    @Column(nullable = false, updatable = false)
    private String createdAt;

    @Column(nullable = true)
    private String source;

}
