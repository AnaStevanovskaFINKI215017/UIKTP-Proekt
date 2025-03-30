package com.uiktp.services.Implementation;

import com.uiktp.entities.users.Course;
import com.uiktp.entities.users.Semester;
import com.uiktp.exceptions.SemesterNotFoundException;
import com.uiktp.repositories.CourseRepository;
import com.uiktp.repositories.SemesterRepository;
import com.uiktp.services.Interface.SemesterServiceI;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SemesterService implements SemesterServiceI {

    private final SemesterRepository semesterRepository;
    private final CourseService courseService;

    public SemesterService(SemesterRepository semesterRepository, CourseService courseService) {
        this.semesterRepository = semesterRepository;
        this.courseService = courseService;
    }

    @Override
    public List<Semester> getAllSemesters() {
        return semesterRepository.findAll();
    }

    @Override
    public Optional<Semester> getSemesterById(Long id) {
        return semesterRepository.findById(id);
    }

    @Override
    public Semester addSemester(Semester semester) {
        return semesterRepository.save(semester);
    }

    @Override
    public Semester updateSemester(Long id, Semester semester) {
        Optional<Semester> existingSemester = semesterRepository.findById(id);
        if (existingSemester.isPresent()) {
            Semester semesterToUpdate = existingSemester.get();
            semesterToUpdate.setName(semester.getName());
            return semesterRepository.save(semesterToUpdate);
        }
        return null;
    }

    @Override
    public Semester addCourseToSemester(Long id, Long courseId) {

        Semester semester = semesterRepository.findById(id).orElseThrow(SemesterNotFoundException::new);
        List<Course> courses = semester.getCourses();
        if (courses.size() >= 5) {
            throw new IllegalStateException("A semester can have a maximum of 5 courses.");
        }
        Course course = courseService.getCourseById(courseId);
        courses.add(course);
        semester.setCourses(courses);
        return semesterRepository.save(semester);
    }


    @Override
    public void deleteSemester(Long id) {
        semesterRepository.deleteById(id);
    }
}
