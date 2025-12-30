package com.ikon.zyberhero.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.ActivityCreateRequestDto;
import com.ikon.zyberhero.dto.response.ActivityResponseDto;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Activity APIs", description = "Activity ingestion and listing")
@RequestMapping("/api")
public interface ActivityApi {

    @PostMapping("/activity")
    ResponseEntity<?> createActivity(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                     @RequestBody ActivityCreateRequestDto request);

    @GetMapping("/activity")
    ResponseEntity<List<ActivityResponseDto>> listActivity(@RequestHeader(value = "Authorization", required = false) String accessToken);

}
