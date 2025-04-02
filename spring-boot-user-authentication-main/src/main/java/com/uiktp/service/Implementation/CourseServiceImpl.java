package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.repository.CourseRepository;
import com.uiktp.service.Interface.CourseService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow();
    }

    @Override
    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public Course updateCourse(Long id, Course course) {
        Optional<Course> existingCourse = courseRepository.findById(id);
        if (existingCourse.isPresent()) {
            Course courseToUpdate = existingCourse.get();
            courseToUpdate.setTitle(course.getTitle());
            courseToUpdate.setDescription(course.getDescription());
            // no changes in semestars and courses?
            return courseRepository.save(courseToUpdate);
        }
        return null;
    }

    @Override
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    @Override
    public void importCoursesFromCSV(MultipartFile file) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
        String line;
        List<Course> courses = new ArrayList<>();
        reader.readLine();
        while ((line = reader.readLine()) != null) {
            String[] values = line.split(",");

            if (values.length >= 2) {
                String title = values[0].trim();
                String description = values[1].trim();

                Course course = new Course();
                course.setTitle(title);
                course.setDescription(description);

                courses.add(course);
            }
        }

        courseRepository.saveAll(courses);
    }

    @Override
    public void importCoursesFromExcel(MultipartFile file) throws IOException {
        InputStream inputStream = file.getInputStream();

        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);
        Iterator<Row> rowIterator = sheet.iterator();

        List<Course> courses = new ArrayList<>();

        if (rowIterator.hasNext()) rowIterator.next();
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();

            String title = row.getCell(0).getStringCellValue().trim();
            String description = row.getCell(1).getStringCellValue().trim();

            Course course = new Course();
            course.setTitle(title);
            course.setDescription(description);

            courses.add(course);
        }
        workbook.close();

        courseRepository.saveAll(courses);
    }
}