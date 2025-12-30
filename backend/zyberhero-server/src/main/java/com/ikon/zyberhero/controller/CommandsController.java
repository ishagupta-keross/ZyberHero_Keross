package com.ikon.zyberhero.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.ikon.zyberhero.api.CommandsApi;
import com.ikon.zyberhero.dto.request.CommandRequestDto;
import com.ikon.zyberhero.dto.response.CommandResponseDto;
import com.ikon.zyberhero.service.CommandsService;

@RestController
@RequiredArgsConstructor
public class CommandsController implements CommandsApi {

    private final CommandsService commandsService;

    @Override
    public ResponseEntity<?> kill(String accessToken, CommandRequestDto request) {
        try {
            commandsService.kill(request);
            return ResponseEntity.ok(java.util.Map.of("success", true));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to create kill command"));
        }
    }

    @Override
    public ResponseEntity<?> relaunch(String accessToken, CommandRequestDto request) {
        try {
            commandsService.relaunch(request);
            return ResponseEntity.ok(java.util.Map.of("success", true));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to create relaunch command"));
        }
    }

    @Override
    public ResponseEntity<?> schedule(String accessToken, CommandRequestDto request) {
        try {
            commandsService.schedule(request);
            return ResponseEntity.ok(java.util.Map.of("success", true));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to create schedule command"));
        }
    }

    @Override
    public ResponseEntity<List<CommandResponseDto>> pending(String accessToken, String deviceUuid, Long deviceId, String machineName) {
        try {
            var list = commandsService.pending(deviceUuid, deviceId, machineName);
            return ResponseEntity.ok(list);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<?> ack(String accessToken, @PathVariable("id") Long id) {
        try {
            commandsService.ack(id);
            return ResponseEntity.ok(java.util.Map.of("success", true));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to acknowledge command"));
        }
    }

}
