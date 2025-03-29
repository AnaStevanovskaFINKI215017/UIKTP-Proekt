package com.uiktp.repositories;

import com.uiktp.entities.users.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;
@EnableJpaRepositories
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByTitle(String title);
}