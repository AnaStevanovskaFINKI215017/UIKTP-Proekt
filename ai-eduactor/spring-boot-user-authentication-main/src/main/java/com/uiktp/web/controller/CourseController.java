package com.uiktp.web.controller;

import com.uiktp.model.Course;
import com.uiktp.model.dtos.CreateCourseDto;
import com.uiktp.service.Interface.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    public Course createCourse(@RequestBody CreateCourseDto dto) {
        return courseService.addCourse(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        return ResponseEntity.ok(courseService.updateCourse(id, course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}/favorite/add")
    public ResponseEntity<Course> markAsFavorite(@PathVariable Long id, @RequestParam String email){
        return  ResponseEntity.ok(courseService.markAsFavorite(id, email));
    }

    @PutMapping("{id}/favorite/remove")
    public ResponseEntity<Void> removeFromFavorites(@PathVariable Long id, @RequestParam String email){
        courseService.removeCourseFromFavorites(id, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Course>> getStudentFavorites(@RequestParam String email){
        return ResponseEntity.ok(courseService.getStudentFavorites(email));
    }
}