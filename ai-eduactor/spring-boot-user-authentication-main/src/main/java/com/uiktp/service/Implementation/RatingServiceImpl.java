package com.uiktp.service.Implementation;

import com.uiktp.model.Course;
import com.uiktp.model.Rating;
import com.uiktp.model.User;
import com.uiktp.model.dtos.RatingDTO;
import com.uiktp.model.exceptions.general.ResourceNotFoundException;
import com.uiktp.repository.CourseRepository;
import com.uiktp.repository.RatingRepository;
import com.uiktp.repository.UserRepository;
import com.uiktp.service.Interface.RatingService;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public RatingServiceImpl(RatingRepository ratingRepository, UserRepository userRepository,
                         CourseRepository courseRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        }
    public Rating addRating(Long courseId, RatingDTO dto) {
        User user = userRepository.findByEmail(dto.getStudentEmail())
                .orElseThrow(() -> new ResourceNotFoundException(User.class, dto.getStudentEmail()));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));

        Rating existingRating = ratingRepository.findRatingByStudentAndCourse(user, course);

        if(existingRating != null){
            existingRating.setRatingValue(dto.getRatingValue());
            existingRating.setDate(LocalDateTime.now());
            return ratingRepository.save(existingRating);
        }

        Rating rating = new Rating();
        rating.setRatingValue(dto.getRatingValue());
        rating.setStudent(user);
        rating.setCourse(course);
        rating.setDate(LocalDateTime.now());

        return ratingRepository.save(rating);
    }

    public double getAverageRating(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException(Course.class, courseId.toString()));
        List<Rating> ratings = ratingRepository.findByCourseId(course.getId());

        return ratings.stream().mapToInt(Rating::getRatingValue).average().orElse(0.0);
    }

}
