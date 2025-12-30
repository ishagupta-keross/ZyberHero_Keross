package com.ikon.zyberhero.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikon.zyberhero.dto.request.CommandRequestDto;
import com.ikon.zyberhero.dto.response.CommandResponseDto;
import com.ikon.zyberhero.entity.ControlCommand;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.mapper.CommandMapper;
import com.ikon.zyberhero.repository.ControlCommandRepository;
import com.ikon.zyberhero.repository.DeviceRepository;

@Service
@RequiredArgsConstructor
public class CommandsService {

    private final ControlCommandRepository commandRepository;
    private final DeviceRepository deviceRepository;
    private final CommandMapper commandMapper;

    @Transactional
    public void kill(CommandRequestDto req) {
        Long deviceId = resolveDeviceId(req);
        String app = req.getAppName() == null ? "" : req.getAppName().toLowerCase();

        var found = commandRepository.findFirstByDeviceIdAndAppNameAndAction(deviceId, app, "kill");
        if (found.isPresent()) {
            ControlCommand c = found.get();
            c.setIsActive(true);
            c.setCreatedAt(LocalDateTime.now());
            commandRepository.save(c);
        } else {
            ControlCommand c = new ControlCommand();
            c.setDeviceId(deviceId);
            c.setAppName(app);
            c.setAction("kill");
            c.setIsActive(true);
            c.setCreatedAt(LocalDateTime.now());
            commandRepository.save(c);
        }
    }

    @Transactional
    public void relaunch(CommandRequestDto req) {
        Long deviceId = resolveDeviceId(req);
        String app = req.getAppName() == null ? "" : req.getAppName().toLowerCase();

        // deactivate kill commands
        var kills = commandRepository.findFirstByDeviceIdAndAppNameAndAction(deviceId, app, "kill");
        kills.ifPresent(c -> { c.setIsActive(false); commandRepository.save(c); });

        // upsert relaunch
        var foundR = commandRepository.findFirstByDeviceIdAndAppNameAndAction(deviceId, app, "relaunch");
        if (foundR.isPresent()) {
            ControlCommand c = foundR.get();
            c.setIsActive(true);
            c.setCreatedAt(LocalDateTime.now());
            commandRepository.save(c);
        } else {
            ControlCommand c = new ControlCommand();
            c.setDeviceId(deviceId);
            c.setAppName(app);
            c.setAction("relaunch");
            c.setIsActive(true);
            c.setCreatedAt(LocalDateTime.now());
            commandRepository.save(c);
        }
    }

    @Transactional
    public void schedule(CommandRequestDto req) {
        Long deviceId = resolveDeviceId(req);
        String app = req.getAppName() == null ? "" : req.getAppName().toLowerCase();

        ControlCommand c = new ControlCommand();
        c.setDeviceId(deviceId);
        c.setAppName(app);
        c.setAction("schedule");
        c.setSchedule(req.getSchedule());
        c.setIsActive(true);
        c.setCreatedAt(LocalDateTime.now());
        commandRepository.save(c);
    }

    @Transactional(readOnly = true)
    public List<CommandResponseDto> pending(String deviceUuid, Long deviceId, String machineName) {
    Long resolved = resolveDeviceId(deviceUuid, deviceId, machineName);
    var active = commandRepository.findByDeviceIdAndIsActiveTrue(resolved);
    var commands = active.stream().map(commandMapper::mapToDto).collect(Collectors.toList());

    // deactivate one-time commands (relaunch/schedule)
    active.stream().filter(c -> !"kill".equals(c.getAction())).forEach(c -> { c.setIsActive(false); commandRepository.save(c); });

    return commands;
    }

    @Transactional
    public void ack(Long id) {
        commandRepository.findById(id).ifPresent(c -> {
            if (Boolean.TRUE.equals(c.getIsActive())) {
                c.setIsActive(false);
                commandRepository.save(c);
            }
        });
    }

    private Long resolveDeviceId(CommandRequestDto req) {
        if (req.getDeviceId() != null && req.getDeviceId() > 0) return req.getDeviceId();
        if (req.getDeviceUuid() != null) {
            Device d = deviceRepository.findByDeviceUuid(req.getDeviceUuid()).orElseThrow(() -> new IllegalArgumentException("Device not registered"));
            return d.getId();
        }
        throw new IllegalArgumentException("deviceUuid or deviceId required");
    }

    private Long resolveDeviceId(String deviceUuid, Long deviceId, String machineName) {
        if (deviceId != null && deviceId > 0) return deviceId;
        if (deviceUuid != null) {
            Device d = deviceRepository.findByDeviceUuid(deviceUuid).orElseThrow(() -> new IllegalArgumentException("Device not registered"));
            return d.getId();
        }
        if (machineName != null) {
            Device d = deviceRepository.findFirstByMacAddress(machineName).orElseThrow(() -> new IllegalArgumentException("Device not registered"));
            return d.getId();
        }
        throw new IllegalArgumentException("deviceUuid or deviceId or machineName required");
    }

}
