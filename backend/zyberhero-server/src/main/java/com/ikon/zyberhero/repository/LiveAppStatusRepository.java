package com.ikon.zyberhero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ikon.zyberhero.entity.LiveAppStatus;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LiveAppStatusRepository extends JpaRepository<LiveAppStatus, Long> {

	List<LiveAppStatus> findByDeviceIdAndIsRunningTrueAndLastSeenGreaterThanEqual(Long deviceId, LocalDateTime cutoff);

	List<LiveAppStatus> findByDeviceIdAndIsRunningTrue(Long deviceId);

	java.util.Optional<LiveAppStatus> findFirstByDeviceIdAndAppName(Long deviceId, String appName);

}
