package com.ikon.zyberhero.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "locations", indexes = {@Index(columnList = "device_id"), @Index(columnList = "timestamp")})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp = LocalDateTime.now();

    private Double latitude;

    private Double longitude;

    private Double accuracy;

    private Double altitude;

    @Column(name = "device_id")
    private Long deviceId;

}
