package com.uiktp.service.Interface;

import com.uiktp.model.Semester;

import java.util.List;
import java.util.Optional;

public interface SemesterService {
    List<Semester> getAllSemesters();
    Optional<Semester> getSemesterById(Long id);
    Semester addSemester(Semester semester);
    Semester updateSemester(Long id, Semester semester);
    Semester addCourseToSemester(Long id, Long courseId);

    void deleteSemester(Long id);
}
