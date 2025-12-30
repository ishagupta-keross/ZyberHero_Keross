package com.ikon.zyberhero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ikon.zyberhero.entity.Alert;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

	Optional<Alert> findFirstByDeviceIdOrderByIdDesc(Long deviceId);

	List<Alert> findByDeviceIdOrderByIdDesc(Long deviceId, Pageable pageable);

	long countByTimestampGreaterThanEqual(LocalDateTime since);

}
