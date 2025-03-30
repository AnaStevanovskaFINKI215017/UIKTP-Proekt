package com.uiktp.controllers;

import com.uiktp.entities.users.Semester;
import com.uiktp.entities.users.User;
import com.uiktp.repositories.SemesterRepository;
import com.uiktp.repositories.UserRepository;
import com.uiktp.services.Implementation.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/semesters")
public class SemesterController {

    @Autowired
    private SemesterService semesterService;

    @Autowired
    private UserRepository userRepository;
    private SemesterRepository semesterRepository;

    @GetMapping
    public List<Semester> getAllSemesters() {
        return semesterService.getAllSemesters();
    }

    @GetMapping("/{id}")
    public Optional<Semester> getSemesterById(@PathVariable Long id) {
        return semesterService.getSemesterById(id);
    }

    @PostMapping
    public ResponseEntity<Semester> createSemester(@RequestBody Semester semester) {
        return new ResponseEntity<>(semesterService.addSemester(semester), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Semester> updateSemester(@PathVariable Long id, @RequestBody Semester semester) {
        return ResponseEntity.ok(semesterService.updateSemester(id, semester));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSemester(@PathVariable Long id) {
        semesterService.deleteSemester(id);
        return ResponseEntity.noContent().build();
    }

    public Semester enrollStudentInSemester(Long studentId, Long semesterId) {
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        Semester semester = semesterRepository.findById(semesterId).orElseThrow(() -> new RuntimeException("Semester not found"));
        semester.setStudent(student);
        return semesterRepository.save(semester);
    }

    @PostMapping("/addCourse/{semesterId}")
    public Semester addCourseToSemester(@PathVariable Long semesterId, @RequestParam Long courseId){
        return semesterService.addCourseToSemester(semesterId,courseId);
    }

}