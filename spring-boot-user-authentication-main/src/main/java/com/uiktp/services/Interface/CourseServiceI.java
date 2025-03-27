package com.uiktp.services.Interface;

import com.uiktp.entities.users.Course;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface CourseServiceI {
    List<Course> getAllCourses();
    Optional<Course> getCourseById(Long id);
    Course addCourse(Course course);
    Course updateCourse(Long id, Course course);
    void deleteCourse(Long id);
}
