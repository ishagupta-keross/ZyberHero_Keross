package com.ikon.zyberhero.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "control_commands", indexes = {@Index(columnList = "device_id")},
       uniqueConstraints = {@UniqueConstraint(columnNames = {"device_id", "app_name", "action"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ControlCommand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String schedule;

    private Boolean isActive = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "app_name")
    private String appName;

    private String action;

    @Column(name = "device_id")
    private Long deviceId;

}
