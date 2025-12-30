package com.ikon.zyberhero.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.ChildCreateRequestDto;
import com.ikon.zyberhero.dto.response.ChildResponseDto;
import com.ikon.zyberhero.service.ChildService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/children")
@RequiredArgsConstructor
public class ChildController {

    private final ChildService childService;

    @PostMapping
    public ResponseEntity<?> createChild(@RequestBody ChildCreateRequestDto req) {
        if (req.getName() == null || req.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Child name is required."));
        }

        var created = childService.createChild(req);
        return ResponseEntity.created(URI.create("/api/children/" + created.getId())).body(java.util.Map.of("success", true, "child", created));
    }

    @GetMapping
    public ResponseEntity<?> listChildren() {
        List<ChildResponseDto> children = childService.listChildren();
        return ResponseEntity.ok(java.util.Map.of("children", children));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getChild(@PathVariable("id") Long id) {
        if (id == null || id <= 0) return ResponseEntity.badRequest().body(java.util.Map.of("error","Invalid child ID format."));
        var c = childService.getChildById(id);
        if (c == null) return ResponseEntity.status(404).body(java.util.Map.of("error", "Child with ID " + id + " not found"));
        return ResponseEntity.ok(java.util.Map.of("child", c));
    }
}
