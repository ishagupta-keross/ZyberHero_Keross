package com.ikon.zyberhero.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ikon.zyberhero.entity.Event;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventRepository extends JpaRepository<Event, UUID> {
    Page<Event> findByAccountId(UUID accountId, Pageable pageable);

    Page<Event> findByAccountIdAndSourceIdentifier(UUID accountId, UUID sourceIdentifier, Pageable pageable);

    Event findByIdAndAccountId(UUID id, UUID accountId);
}
