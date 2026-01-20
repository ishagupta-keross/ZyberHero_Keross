package com.ikon.zyberhero.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "safe_zones", indexes = {
    @Index(columnList = "child_id"),
    @Index(columnList = "device_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SafeZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_id", nullable = false)
    private Long childId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Integer radius; // in meters

    @Column(length = 500)
    private String address;

    @Column(name = "device_id")
    private Long deviceId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
