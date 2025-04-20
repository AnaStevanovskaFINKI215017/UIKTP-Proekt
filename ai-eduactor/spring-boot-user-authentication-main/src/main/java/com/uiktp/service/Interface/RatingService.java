package com.uiktp.service.Interface;

import com.uiktp.model.Rating;
import com.uiktp.model.dtos.RatingDTO;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface RatingService {
    Rating addRating(Long courseId, RatingDTO dto);
    double getAverageRating(Long courseId);
}

