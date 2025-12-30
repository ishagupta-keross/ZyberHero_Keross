package com.ikon.zyberhero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ikon.zyberhero.entity.ActivityLog;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

	List<ActivityLog> findByTimestampBetweenAndDurationSecondsGreaterThan(LocalDateTime start, LocalDateTime end, int durationSeconds);

	List<ActivityLog> findByTimestampBetweenAndDeviceIdInAndDurationSecondsGreaterThan(LocalDateTime start, LocalDateTime end, List<Long> deviceIds, int durationSeconds);

	@Query("SELECT COALESCE(SUM(a.durationSeconds),0) FROM ActivityLog a WHERE a.timestamp >= :start AND a.timestamp < :end AND a.screenTime = :screen AND (:deviceId IS NULL OR a.deviceId = :deviceId)")
	Long sumDurationBetweenForDevice(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("screen") boolean screen, @Param("deviceId") Long deviceId);

	@Query("SELECT COALESCE(SUM(a.durationSeconds),0) FROM ActivityLog a WHERE a.timestamp >= :start AND a.timestamp < :end AND a.screenTime = :screen AND (:deviceIdsSize = 0 OR a.deviceId IN :deviceIds)")
	Long sumDurationBetweenForDevices(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("screen") boolean screen, @Param("deviceIds") List<Long> deviceIds, @Param("deviceIdsSize") int deviceIdsSize);

}
