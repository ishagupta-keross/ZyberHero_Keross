package com.ikon.zyberhero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ikon.zyberhero.entity.Location;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

	java.util.Optional<Location> findFirstByDeviceIdOrderByTimestampDesc(Long deviceId);

	List<Location> findByDeviceIdOrderByTimestampDesc(Long deviceId);

	List<Location> findByDeviceIdAndTimestampBetweenOrderByTimestampDesc(Long deviceId, LocalDateTime start, LocalDateTime end);

}
