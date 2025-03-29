package com.uiktp.repositories;

import com.uiktp.entities.users.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;
@EnableJpaRepositories
@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    boolean existsByName(String semester);
}
