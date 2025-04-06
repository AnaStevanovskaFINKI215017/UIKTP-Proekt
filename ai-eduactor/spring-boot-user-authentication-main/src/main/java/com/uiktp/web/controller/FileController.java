package com.uiktp.web.controller;

import com.uiktp.service.Interface.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final CourseService courseService;

    public FileController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping(value = "/importCourses", consumes = {"multipart/form-data"})
    public ResponseEntity<String> importCourses(@RequestParam("file") MultipartFile file) {
        String filename = file.getOriginalFilename();

        try{
            if (filename.endsWith(".csv")){
                courseService.importCoursesFromCSV(file);
                return ResponseEntity.ok("File processed successfully");
            } else if (filename.endsWith(".xls") || filename.endsWith(".xlsx")){
                courseService.importCoursesFromExcel(file);
                return ResponseEntity.ok("File processed successfully");
            }
            else {
                return ResponseEntity.badRequest().body("Invalid file type.");
            }
        }catch (IOException e) {
            return ResponseEntity.badRequest().body("Invalid file content");
        }

    }


}
