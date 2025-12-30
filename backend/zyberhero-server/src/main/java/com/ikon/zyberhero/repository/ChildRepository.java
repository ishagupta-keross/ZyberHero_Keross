package com.ikon.zyberhero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ikon.zyberhero.entity.Child;

@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {

}
