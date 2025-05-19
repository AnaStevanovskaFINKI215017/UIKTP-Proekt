import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './CourseHub.css';
import CustomNavbar from '../app-custom/CustomNavbar';
import {
    addCourseToFavorites,
    getCourses,
    getFavoriteCourses,
    removeCourseFromFavorites,
} from '../../services/api';
import {FaHeart, FaRegHeart} from "react-icons/fa6";
import StarRatings from 'react-star-ratings';

const CourseHub = () => {
    const [subjects, setSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [favoritesFirst, setFavoritesFirst] = useState(false);
    const [favorites, setFavorites] = useState({});
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favoriteCourses');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
        fetchCourses();
        fetchFavorites();
    }, []);

    const fetchCourses = async () => {
        try {
            setError(null);
            const data = await getCourses();
            const formattedCourses = data.map(course => ({
                id: course.id,
                name: course.title,
                avgRating: course.avgRating
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
            localStorage.setItem('favoriteCourses', JSON.stringify(favoriteMap));
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    const filteredSubjects = subjects.filter(subject => {
        const matchesSearch = !searchQuery || subject.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isFavorite = favorites[subject.id];
        return matchesSearch && (!showOnlyFavorites || isFavorite);
    });

    const sortedSubjects = favoritesFirst
        ? [...filteredSubjects].sort((a, b) => {
            const aFav = !!favorites[a.id];
            const bFav = !!favorites[b.id];
            return aFav === bFav ? 0 : aFav ? -1 : 1;
        })
        : filteredSubjects;

    const handleToggleFavorite = async (courseId) => {
        try {
            const isFavorite = favorites[courseId];
            if (isFavorite) {
                await removeCourseFromFavorites(courseId);
            } else {
                await addCourseToFavorites(courseId);
            }

            setFavorites(prev => {
                const updated = {...prev, [courseId]: !isFavorite};
                localStorage.setItem('favoriteCourses', JSON.stringify(updated));
                return updated;
            });
        } catch (err) {
            console.error('Error updating favorite:', err);
        }
    };

    return (
        <>
            <CustomNavbar/>
            <div className="header-section">
                <h1>Course Hub</h1>
                <p>Welcome to the Course Hub – your all-in-one space for academic collaboration and engagement.
                    Here, you can mark your favorite courses for easy access, rate and review them based on your
                    experience,
                    and share valuable feedback with your peers. The hub also allows you to upload and access study
                    materials,
                    enabling file-sharing between students. Plus, you can take default quizzes created from the
                    flashcards contributed
                    by other students in your course – making learning more dynamic and collective.</p>
                <div className="header-controls">
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
            </div>

            {error && <div className="global-error-message">{error}</div>}

            <div className="subject-reviews-container">
                <div className="filter-toggle-container">
                    <button
                        className={`favorites-toggle-btn ${showOnlyFavorites ? 'active' : ''}`}
                        onClick={() => setShowOnlyFavorites(prev => !prev)}
                    >
                        {showOnlyFavorites ? 'Show All Courses' : 'Show Favorites Only'}
                    </button>
                </div>
                <div className="subjects-grid">
                    {sortedSubjects.length > 0 ? (
                        sortedSubjects.map(subject => (
                            <div
                                key={subject.id}
                                className="subject-box clickable"
                                onClick={() => navigate(`/course/${subject.id}/reviews`)}
                            >
                                <div className="subject-title-row">
                                    <h3>{subject.name}</h3>
                                    <button
                                        className="heart-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleFavorite(subject.id);
                                        }}
                                        aria-label="Toggle Favorite"
                                    >
                                        {favorites[subject.id] ? (
                                            <FaHeart className="subject-heart-icon"/>
                                        ) : (
                                            <FaRegHeart className="subject-heart-icon"/>
                                        )}
                                    </button>
                                </div>
                                <div className="rating-container">
                                    <label>Average Rating:</label>
                                    <StarRatings
                                        rating={subject.avgRating || 0}
                                        starRatedColor="#ffc107"
                                        numberOfStars={5}
                                        name={`avg-rating-${subject.id}`}
                                        starDimension="25px"
                                        starSpacing="2px"
                                        starEmptyColor="#ddd"
                                        isSelectable={false}
                                    />
                                    <span className="avg-rating-value">
                                        {subject.avgRating ? subject.avgRating.toFixed(1) : 'No rating yet'}
                                    </span>
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

export default CourseHub;
