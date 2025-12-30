package com.ikon.zyberhero.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "live_app_status", indexes = {@Index(columnList = "device_id")},
       uniqueConstraints = {@UniqueConstraint(columnNames = {"device_id", "app_name"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiveAppStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app_name")
    private String appName;

    private String windowTitle;

    private Boolean isRunning = false;

    private LocalDateTime lastSeen = LocalDateTime.now();

    @Column(name = "device_id")
    private Long deviceId;

}
