package com.uiktp.service.Interface;

import com.uiktp.model.Course;

import java.util.List;

public interface CourseService {
    List<Course> getAllCourses();
    Course getCourseById(Long id);
    Course addCourse(Course course);
    Course updateCourse(Long id, Course course);
    void deleteCourse(Long id);
}
