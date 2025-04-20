import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseReviews.css';
import CustomNavbar from './CustomNavbar';
import {
    addCourseToFavorites,
    getCourses,
    getFavoriteCourses,
    removeCourseFromFavorites,
    submitSubjectReview
} from '../repository/api';
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import StarRatings from 'react-star-ratings';

const CourseReviews = () => {
    const [subjects, setSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState({});
    const [successMessages, setSuccessMessages] = useState({});
    const [isSubmitting, setIsSubmitting] = useState({});
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState({});

    useEffect(() => {
        fetchCourses();
        fetchFavorites();
    }, []);

    const fetchCourses = async () => {
        try {
            setError(null);
            const data = await getCourses();
            console.log(data);
            const formattedCourses = data.map(course => ({
                id: course.id,
                name: course.title,
            }));
            setSubjects(formattedCourses);
        } catch (err) {
            setError('Failed to fetch courses. Please try again later.');
            console.error('Error fetching courses:', err);
        }
    };

    const fetchFavorites = async () => {
        try {
            const data = await getFavoriteCourses();
            const favoriteMap = {};

            data.forEach(course => {
                favoriteMap[course.id] = true;
            });

            setFavorites(favoriteMap);
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    const handleSubmitReview = async (courseId) => {
        const review = reviews[courseId];
        if (!review || !review.rating) {
            // Show error for this specific course
            setReviews(prev => ({
                ...prev,
                [courseId]: {
                    ...prev[courseId],
                    error: 'Please provide a rating'
                }
            }));
            return;
        }

        // Clear any previous errors and set submitting state
        setReviews(prev => ({
            ...prev,
            [courseId]: {
                ...prev[courseId],
                error: null
            }
        }));
        setIsSubmitting(prev => ({ ...prev, [courseId]: true }));

        try {
            // Ensure courseId is a number
            await submitSubjectReview(courseId, {
                rating: review.rating,
                feedback: review.feedback || ''
            });

            // Clear the form after successful submission
            setReviews(prev => ({
                ...prev,
                [courseId]: { rating: 0, feedback: '', error: null }
            }));

            // Show success message
            setSuccessMessages(prev => ({
                ...prev,
                [courseId]: true
            }));

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessages(prev => ({
                    ...prev,
                    [courseId]: false
                }));
            }, 3000);

        } catch (err) {
            console.error('Error submitting review:', err);
            setReviews(prev => ({
                ...prev,
                [courseId]: {
                    ...prev[courseId],
                    error: typeof err === 'string' ? err : 'Failed to submit review. Please try again.'
                }
            }));
        } finally {
            setIsSubmitting(prev => ({ ...prev, [courseId]: false }));
        }
    };

    const handleRatingClick = (courseId, rating) => {
        setReviews(prev => ({
            ...prev,
            [courseId]: { ...prev[courseId], rating: parseFloat(rating), error: null }
        }));
    };

    const handleFeedbackChange = (courseId, feedback) => {
        setReviews(prev => ({
            ...prev,
            [courseId]: { ...prev[courseId], feedback, error: null }
        }));
    };

    const filteredSubjects = subjects.filter(subject => {
        if (!searchQuery) return true;
        return subject?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleViewAllReviews = (courseId) => {
        navigate(`/course/${courseId}/reviews`);
    };

    const handleToggleFavorite = async (courseId) => {
        try {
            const isCurrentlyFavorite = favorites[courseId];

            if (isCurrentlyFavorite) {
                await removeCourseFromFavorites(courseId);
            } else {
                await addCourseToFavorites(courseId);
            }

            setFavorites(prev => ({
                ...prev,
                [courseId]: !isCurrentlyFavorite
            }));
        } catch (err) {
            console.error('Error updating favorite:', err);
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="header-section">
                <h1>Course Reviews</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {error && <div className="global-error-message">{error}</div>}

            <div className="subject-reviews-container">

                <div className="subjects-grid">
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map(subject => (
                            <div key={subject.id} className="subject-box">
                                <div className="subject-title-row">
                                    <h3>{subject.name}</h3>
                                    <button
                                        className="heart-button"
                                        onClick={() => handleToggleFavorite(subject.id)}
                                        aria-label="Toggle Favorite"
                                    >
                                        {favorites[subject.id] ? (
                                            <FaHeart className={"subject-heart-icon"} />
                                        ) : (
                                            <FaRegHeart className={"subject-heart-icon"} />
                                        )}
                                    </button>
                                </div>

                                {/* Show success message if applicable */}
                                {successMessages[subject.id] && (
                                    <div className="success-message">Review submitted successfully!</div>
                                )}

                                {/* Show error if applicable */}
                                {reviews[subject.id]?.error && (
                                    <div className="error-message">{reviews[subject.id].error}</div>
                                )}

                                <div className="rating-container">
                                    <label>Your Rating:</label>
                                    <StarRatings
                                        rating={reviews[subject.id]?.rating || 0}
                                        starRatedColor="#ffc107"
                                        changeRating={(rating) => handleRatingClick(subject.id, rating)}
                                        numberOfStars={5}
                                        name={`rating-${subject.id}`}
                                        starDimension="25px"
                                        starSpacing="2px"
                                        starHoverColor="#ffc107"
                                        starEmptyColor="#ddd"
                                        isHalf={true} // Enable half-star ratings
                                    />
                                </div>

                                <textarea
                                    placeholder="Write your feedback here (optional)..."
                                    value={reviews[subject.id]?.feedback || ''}
                                    onChange={(e) => handleFeedbackChange(subject.id, e.target.value)}
                                    className="review-textarea"
                                />

                                <div className="button-container">
                                    <button
                                        className="submit-btn"
                                        onClick={() => handleSubmitReview(subject.id)}
                                        disabled={isSubmitting[subject.id]}
                                    >
                                        {isSubmitting[subject.id] ? 'Submitting...' : 'Submit Review'}
                                    </button>

                                    <button
                                        className="view-all-btn"
                                        onClick={() => handleViewAllReviews(subject.id, subject.name)}
                                    >
                                        View All Reviews
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">No courses found matching "{searchQuery}"</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CourseReviews;

