package com.ikon.zyberhero.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "alerts", indexes = {@Index(columnList = "device_id")})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(name = "app_name")
    private String appName;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "device_id")
    private Long deviceId;

}
