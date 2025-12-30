package com.ikon.zyberhero.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.ChildCreateRequestDto;
import com.ikon.zyberhero.dto.response.ChildResponseDto;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Child APIs", description = "Child related APIs")
@RequestMapping("/api/children")
public interface ChildApi {

    @PostMapping
    ResponseEntity<ChildResponseDto> createChild(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                   @RequestBody ChildCreateRequestDto request);

    @GetMapping
    ResponseEntity<ChildResponseDto> listChildren(@RequestHeader(value = "Authorization", required = false) String accessToken);

    @GetMapping("/{id}")
    ResponseEntity<ChildResponseDto> getChildById(@RequestHeader(value = "Authorization", required = false) String accessToken,
                                   @PathVariable("id") Long id);
}
