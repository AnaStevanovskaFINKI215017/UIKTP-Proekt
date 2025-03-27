package com.uiktp.services.Implementation;

import com.uiktp.entities.users.Semester;
import com.uiktp.repositories.SemesterRepository;
import com.uiktp.services.Interface.SemesterServiceI;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SemesterService implements SemesterServiceI {

    private final SemesterRepository semesterRepository;

    public SemesterService(SemesterRepository semesterRepository) {
        this.semesterRepository = semesterRepository;
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
    public void deleteSemester(Long id) {
        semesterRepository.deleteById(id);
    }
}
