package com.ikon.zyberhero.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "safe_zones", indexes = {@Index(columnList = "child_id")})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SafeZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_id")
    private Long childId;

    private String name;

    private Double latitude;

    private Double longitude;

    private Integer radius;

    private LocalDateTime createdAt = LocalDateTime.now();

}
