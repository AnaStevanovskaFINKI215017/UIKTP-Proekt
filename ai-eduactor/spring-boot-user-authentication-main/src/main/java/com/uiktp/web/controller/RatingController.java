package com.uiktp.web.controller;

import com.uiktp.model.Rating;
import com.uiktp.model.User;
import com.uiktp.model.dtos.RatingDTO;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.service.Interface.RatingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/courses/{courseId}/ratings")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> addRating(@PathVariable Long courseId, @RequestBody RatingDTO dto) {
        return ResponseEntity.ok(ratingService.addRating(courseId, dto));
    }

    @GetMapping("/average")
    public ResponseEntity<Double> getAverage(@PathVariable Long courseId) {
        return ResponseEntity.ok(ratingService.getAverageRating(courseId));
    }
}

