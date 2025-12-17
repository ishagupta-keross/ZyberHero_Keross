package com.ikon.zyberhero.api;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ikon.zyberhero.dto.request.EventCreateRequestDto;
import com.ikon.zyberhero.dto.response.EventResponseDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;


import org.springframework.data.domain.Page;

@Tag(name = "Event APIs", description = "Event related APIs")
@RequestMapping("/event")
public interface EventApi {

    @Operation(summary = "Create a new event", description = "Creates a new event and returns the created event details.", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Event details", required = true, content = @Content(schema = @Schema(implementation = EventCreateRequestDto.class))), responses = {
            @ApiResponse(responseCode = "201", description = "Event created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid event data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    ResponseEntity<EventResponseDto> createEvent(@RequestHeader("Authorization") String accessToken,
            @RequestBody EventCreateRequestDto eventRequestDto);

    @Operation(summary = "Get all events", description = "Fetches a list of all events.", responses = {
            @ApiResponse(responseCode = "200", description = "List of events fetched successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    ResponseEntity<Page<EventResponseDto>> getAllEvents(@RequestHeader("Authorization") String accessToken, Pageable pageable);

    @Operation(summary = "Get event by source identifier", description = "Fetches all events linked to a specific source identifier.", parameters = {
            @Parameter(name = "sourceIdentifier", description = "Source identifier to filter contact", required = true)
    }, responses = {
            @ApiResponse(responseCode = "200", description = "event fetched successfully"),
            @ApiResponse(responseCode = "404", description = "No event found for the given source identifier"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/eventsource/{sourceIdentifier}")
    ResponseEntity<Page<EventResponseDto>> getEventsByIdentifier(
            @RequestHeader("Authorization") String accessToken,
            @PathVariable UUID sourceIdentifier, Pageable pageable);

    @Operation(summary = "Get details of a specific event", description = "Fetches the details of a event by its unique eventid.", parameters = {
            @Parameter(name = "eventId", description = "Unique identifier of the Contact")
    }, responses = {
            @ApiResponse(responseCode = "200", description = "event details fetched successfully"),
            @ApiResponse(responseCode = "404", description = "event not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })

    @GetMapping("/{eventId}")
    ResponseEntity<EventResponseDto> getEventById(@RequestHeader("Authorization") String accessToken,
            @PathVariable("eventId") UUID eventId); 


    @Operation(summary = "Update an existing event", description = "Updates the details of an existing event.", parameters = {
            @Parameter(name = "eventId", description = "Unique identifier of the event to be updated")
    }, requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated event details", required = true, content = @Content(schema = @Schema(implementation = EventCreateRequestDto.class))), responses = {
            @ApiResponse(responseCode = "200", description = "Event updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid event data"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })  
    @PutMapping("/{eventId}")
    ResponseEntity<EventResponseDto> updateEvent(@RequestHeader("Authorization") String accessToken,
            @PathVariable UUID eventId, @RequestBody EventCreateRequestDto eventRequestDto);
}
