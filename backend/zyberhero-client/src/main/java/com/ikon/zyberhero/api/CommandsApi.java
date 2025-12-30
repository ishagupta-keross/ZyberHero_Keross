package com.ikon.zyberhero.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.CommandRequestDto;
import com.ikon.zyberhero.dto.response.CommandResponseDto;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Commands APIs", description = "Control commands for devices")
@RequestMapping("/api/commands")
public interface CommandsApi {

    @PostMapping("/kill")
    ResponseEntity<?> kill(@RequestHeader(value = "Authorization", required = false) String accessToken,
                           @RequestBody CommandRequestDto request);

    @PostMapping("/relaunch")
    ResponseEntity<?> relaunch(@RequestHeader(value = "Authorization", required = false) String accessToken,
                               @RequestBody CommandRequestDto request);

    @PostMapping("/schedule")
    ResponseEntity<?> schedule(@RequestHeader(value = "Authorization", required = false) String accessToken,
                               @RequestBody CommandRequestDto request);

    @GetMapping("/pending")
    ResponseEntity<List<CommandResponseDto>> pending(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                                     @RequestParam(value = "deviceUuid", required = false) String deviceUuid,
                                                     @RequestParam(value = "deviceId", required = false) Long deviceId,
                                                     @RequestParam(value = "machineName", required = false) String machineName);

    @PostMapping("/ack/{id}")
    ResponseEntity<?> ack(@RequestHeader(value = "Authorization", required = false) String accessToken,
                          @PathVariable("id") Long id);

}
