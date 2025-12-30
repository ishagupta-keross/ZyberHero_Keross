package com.ikon.zyberhero.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ikon.zyberhero.entity.Device;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findByDeviceUuid(String deviceUuid);
    Optional<Device> findFirstByMacAddress(String macAddress);
    Optional<Device> findFirstByMachineName(String machineName);
    List<Device> findByChildId(Integer childId);
}
