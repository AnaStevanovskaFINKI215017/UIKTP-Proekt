package com.uiktp.service.Interface;

import com.uiktp.model.Course;
import com.uiktp.model.dtos.CourseRecommendationRequestDTO;
import com.uiktp.model.dtos.CreateCourseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CourseService {

    // CRUD
    List<Course> getAllCourses();

    Course getCourseById(Long id);

    Course addCourse(CreateCourseDto dto);

    Course updateCourse(Long id, Course course);

    void deleteCourse(Long id);

    // OTHER
    void importCoursesFromCSV(MultipartFile file) throws IOException;

    void importCoursesFromExcel(MultipartFile file) throws IOException;

    List<Course> getRecommendations();
}
