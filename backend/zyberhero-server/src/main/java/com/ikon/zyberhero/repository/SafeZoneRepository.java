package com.ikon.zyberhero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ikon.zyberhero.entity.SafeZone;

@Repository
public interface SafeZoneRepository extends JpaRepository<SafeZone, Long> {

}
