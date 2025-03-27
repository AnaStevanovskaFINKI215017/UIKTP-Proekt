package com.uiktp.services.Interface;

import com.uiktp.entities.users.Semester;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface SemesterServiceI {
    List<Semester> getAllSemesters();
    Optional<Semester> getSemesterById(Long id);
    Semester addSemester(Semester semester);
    Semester updateSemester(Long id, Semester semester);
    void deleteSemester(Long id);
}
