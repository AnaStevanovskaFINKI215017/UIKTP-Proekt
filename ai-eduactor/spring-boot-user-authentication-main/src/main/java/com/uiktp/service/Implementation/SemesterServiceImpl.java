package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.Semester;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.SemesterRepository;
import com.uiktp.service.Interface.SemesterService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;
    private final CourseServiceImpl courseService;

    public SemesterServiceImpl(SemesterRepository semesterRepository, CourseServiceImpl courseService) {
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

        Semester semester = semesterRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(Semester.class, id.toString()));
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
