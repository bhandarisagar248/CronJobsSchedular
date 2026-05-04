package com.chronos.Repository;

import com.chronos.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
   Optional<User> findByEmail(String email);
   User findByEmailAndId(String email,Long id);
//   Optional<User> findById(Long id);
}

