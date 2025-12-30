package com.ikon.zyberhero.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activity_logs", indexes = {@Index(columnList = "device_id"), @Index(columnList = "timestamp")})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp = LocalDateTime.now();

    private LocalDateTime localTimestamp;

    private String appName;

    private String windowTitle;

    private Integer durationSeconds;

    private String executablePath;

    private Boolean screenTime = false;

    @Column(name = "device_id")
    private Long deviceId;

    // No JPA relation to Device here to keep simple; can be added if desired
}
