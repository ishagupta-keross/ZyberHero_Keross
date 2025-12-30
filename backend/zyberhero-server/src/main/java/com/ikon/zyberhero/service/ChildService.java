package com.ikon.zyberhero.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikon.zyberhero.dto.request.ChildCreateRequestDto;
import com.ikon.zyberhero.dto.response.ChildResponseDto;
import com.ikon.zyberhero.entity.Child;
import com.ikon.zyberhero.entity.Device;
import com.ikon.zyberhero.mapper.ChildMapper;
import com.ikon.zyberhero.repository.ChildRepository;
import com.ikon.zyberhero.repository.DeviceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChildService {

    private final ChildRepository childRepository;
    private final DeviceRepository deviceRepository;
    private final ChildMapper childMapper;

    @Transactional
    public ChildResponseDto createChild(ChildCreateRequestDto req) {
        Child child = childMapper.mapFromDto(req);
        Child saved = childRepository.save(child);

        // Try to assign device if provided
        if (req.getDeviceId() != null) {
            try {
                Optional<Device> dev = deviceRepository.findById(req.getDeviceId());
                if (dev.isPresent()) {
                    Device d = dev.get();
                    d.setChildId(saved.getId().intValue());
                    deviceRepository.save(d);
                } else {
                    // device not found — log warning and continue
                    System.out.println("Warning: Device ID " + req.getDeviceId() + " not found. Skipping assignment.");
                }
            } catch (Exception ex) {
                // log and continue
                System.err.println("Error assigning device: " + ex.getMessage());
            }
        }

        List<Device> devices = deviceRepository.findByChildId(saved.getId().intValue());
        return childMapper.mapToDto(saved, devices);
    }

    @Transactional(readOnly = true)
    public List<ChildResponseDto> listChildren() {
        List<Child> children = childRepository.findAll();
        return children.stream().map(c -> {
            List<Device> devices = deviceRepository.findByChildId(c.getId().intValue());
            return childMapper.mapToDto(c, devices);
        }).toList();
    }

    @Transactional(readOnly = true)
    public ChildResponseDto getChildById(Long id) {
        Optional<Child> c = childRepository.findById(id);
        if (c.isEmpty()) return null;
        List<Device> devices = deviceRepository.findByChildId(id.intValue());
        return childMapper.mapToDto(c.get(), devices);
    }
}
