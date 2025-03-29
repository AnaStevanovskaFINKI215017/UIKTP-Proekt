package com.uiktp.repositories;

import com.uiktp.entities.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
   //UserDetails findByEmail(String email);
   Optional<User> findByEmail(String email);
   boolean existsByEmail(String email);

}
