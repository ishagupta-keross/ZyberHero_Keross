package com.ikon.zyberhero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ikon.zyberhero.entity.ControlCommand;
import java.util.List;
import java.util.Optional;

@Repository
public interface ControlCommandRepository extends JpaRepository<ControlCommand, Long> {

	List<ControlCommand> findByDeviceIdAndIsActiveTrue(Long deviceId);

	Optional<ControlCommand> findFirstByDeviceIdAndAppNameAndAction(Long deviceId, String appName, String action);


}
