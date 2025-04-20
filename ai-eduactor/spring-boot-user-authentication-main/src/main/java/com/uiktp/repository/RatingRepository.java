package com.uiktp.repository;

import com.uiktp.model.Course;
import com.uiktp.model.Rating;
import com.uiktp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByCourseId(Long courseId);
    Rating findRatingByStudentAndCourse(User student, Course course);
}

