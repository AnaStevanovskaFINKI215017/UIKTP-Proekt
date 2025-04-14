package com.uiktp.service.Interface;

import com.uiktp.model.Semester;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface SemesterService {

    //CRUD
    List<Semester> getAllSemesters();
    Optional<Semester> getSemesterById(Long id);
    Semester addSemester(Semester semester);
    Semester updateSemester(Long id, Semester semester);
    Semester addCourseToSemester(Long id, Long courseId);
    void deleteSemester(Long id);
}
