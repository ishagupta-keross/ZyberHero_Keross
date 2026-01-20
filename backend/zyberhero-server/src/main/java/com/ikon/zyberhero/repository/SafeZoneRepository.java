package com.ikon.zyberhero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ikon.zyberhero.entity.SafeZone;

import java.util.List;

@Repository
public interface SafeZoneRepository extends JpaRepository<SafeZone, Long> {
    
    List<SafeZone> findByChildId(Long childId);
    
    List<SafeZone> findByDeviceId(Long deviceId);
    
    List<SafeZone> findByChildIdOrderByCreatedAtDesc(Long childId);
}
