package com.chronos.Repository;

import com.chronos.Entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role,Integer> {
    Optional<Role> findByName(String name);
    Optional<Role> findById(Integer id);
}