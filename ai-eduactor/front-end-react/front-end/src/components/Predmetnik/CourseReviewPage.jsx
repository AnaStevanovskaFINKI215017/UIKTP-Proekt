import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {FaFilePdf} from 'react-icons/fa';
import {FaStar, FaArrowLeft, FaTrash, FaCommentAlt, FaArrowDown, FaArrowUp} from 'react-icons/fa';
import CustomNavbar from '../app-custom/CustomNavbar';
import StarRatings from 'react-star-ratings';
import {
    deleteComment, fetchCommentAttachments,
    getCourses, getFlashCardsByCourse,
    getSubjectReviews,
    submitSubjectComment,
    submitSubjectReview
} from '../../services/api';
import './CourseReviewPage.css';
import {FiUpload} from "react-icons/fi";

const CourseReviewPage = () => {
    const studentEmail = localStorage.getItem("email");
    const navigate = useNavigate();
    const location = useLocation();

    const {courseId} = useParams();
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [comments, setComments] = useState([]);

    const [newReview, setNewReview] = useState({rating: 0, feedback: ''});
    const [commentFeedback, setCommentFeedback] = useState('');

    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [attachmentsMap, setAttachmentsMap] = useState({}); // commentId -> [attachments]
    const [expandedComments, setExpandedComments] = useState(new Set());

    const [defaultFlashCards, setDefaultFlashCards] = useState([]);

    const [activeTab, setActiveTab] = useState('reviews');

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [ratingError, setRatingError] = useState('');
    const [commentError, setCommentError] = useState('');

    useEffect(() => {
        fetchCourseData();
        fetchReviews();
        fetchCourseFlashCards();
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            const courses = await getCourses();
            const course = courses.find(c =>
                String(c.courseId) === String(courseId) ||
                String(c.id) === String(courseId)
            );
            if (course) {
                setCourseName(course.title);
                setCourseDescription(course.description);
            }
        } catch (err) {
            console.error('Error fetching course:', err);
        }
    };

    const fetchReviews = async () => {
        try {
            setError(null);
            const {reviews, comments, averageRating} = await getSubjectReviews(courseId);

            setReviews(reviews);
            setComments(comments);
            setAverageRating(averageRating);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again later.');
        }
    };

    const fetchCourseFlashCards = async () => {
        try {
            const flashcards = await getFlashCardsByCourse(courseId);
            setDefaultFlashCards(flashcards);
        } catch (err) {
            console.error('Error fetching falshCards:', err);
            setError('Failed to fetch falshCards. Please try again later.');
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setRatingError('');
        setError(null);

        if (!newReview.rating || newReview.rating < 1) {
            setRatingError('Please select a rating between 1 and 5 stars');
            return;
        }

        setIsSubmittingReview(true);
        setSuccessMessage('');

        try {
            await submitSubjectReview(courseId, {
                rating: newReview.rating,
                feedback: newReview.feedback,
                isReview: "true"
            });

            setNewReview({rating: 0, feedback: ''});
            setSuccessMessage('Your review was submitted successfully!');
            await fetchReviews();
        } catch (err) {
            console.error('Error submitting review:', err);
            setError(typeof err === 'string' ? err : 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setCommentError('');
        setError(null);

        if (!commentFeedback.trim()) {
            setCommentError('Please write a comment before submitting');
            return;
        }

        setIsSubmittingComment(true);
        setSuccessMessage('');

        try {
            const formData = new FormData();
            formData.append('commentBody', commentFeedback.trim());
            selectedFiles.forEach((file) => {
                formData.append('attachments', file);
            });

            await submitSubjectComment(courseId, formData);
            setCommentFeedback('');
            setSelectedFiles([]);
            setSuccessMessage('Your comment was submitted successfully!');
            await fetchReviews();
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError(typeof err === 'string' ? err : 'Failed to submit comment. Please try again.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleRatingClick = (rating) => {
        setNewReview(prev => ({...prev, rating: Number(rating)}));
    };

    const handleDeleteButton = async (commentId) => {
        try {
            setError(null);
            setSuccessMessage('Your comment has been deleted successfully!');

            const data = await deleteComment(courseId, commentId);

            await fetchReviews();
        } catch (err) {
            console.error('Error deleting comment:', err);
            setError('Failed to delete comment. Please try again later.');
        }
    };

    // Sorting logic for reviews
    const getSortedReviews = () => {
        if (!reviews) return [];
        const sorted = [...reviews].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'latest'
                ? dateB - dateA
                : dateA - dateB;
        });
        return sorted;
    };

    const getSortedComments = () => {
        if (!comments) return [];
        const sorted = [...comments].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'latest'
                ? dateB - dateA
                : dateA - dateB;
        });
        return sorted;
    }

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleRemoveFile = (indexToRemove) => {
        setSelectedFiles(prevFiles =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    const toggleAttachments = async (commentId) => {
        const newExpanded = new Set(expandedComments);

        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);

            // Fetch only if not already loaded
            if (!attachmentsMap[commentId]) {
                try {
                    const attachments = await fetchCommentAttachments(courseId, commentId); // Using the new function
                    setAttachmentsMap(prev => ({...prev, [commentId]: attachments}));
                } catch (err) {
                    console.error(err.message); // Handle error (if any)
                }
            }
        }

        setExpandedComments(newExpanded);
    };

    return (
        <>
            <CustomNavbar/>
            <div className="course-review-container">
                <button
                    className="back-button"
                    onClick={() => navigate('/course-reviews')}
                >
                    <FaArrowLeft/> Back to Course Hub
                </button>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <div className="course-info">
                    <h2>{courseName}</h2>
                    <p>{courseDescription}</p>
                    <div className="average-rating">
                        <span>Average Rating:</span>
                        <span className="rating-value">
        {averageRating ? Number(averageRating).toFixed(1) : 'No ratings yet'}
    </span>
                        {averageRating > 0 && (
                            <StarRatings
                                rating={Number(averageRating) || 0}
                                starRatedColor="#ffc107"
                                numberOfStars={5}
                                name="average-rating"
                                starDimension="25px"
                                starSpacing="2px"
                                starEmptyColor="#ddd"
                                isSelectable={false}
                                isHalf={true}
                            />
                        )}
                    </div>

                </div>

                {/* Flashcards section */}
                {defaultFlashCards && defaultFlashCards.length > 0 && (
                    <div className="flashcards-info">
                        <p>
                            There is a default quiz available for this course! The flashcards every student has
                            generated
                            for this course are used to make a default quiz available for all students! Currently there
                            are {defaultFlashCards.length} unique
                            flashcards available. As more students upload attachments and generate flashcards for this
                            course, there will be more!
                        </p>
                        <button
                            className="back-button"
                            onClick={() => navigate(`/flashcard-game/${courseId}`, {
                                state: {
                                    default: true,
                                    from: location.pathname
                                }
                            })}
                        >
                            Try Quiz
                        </button>
                    </div>
                )}

                <div className="tab-buttons">
                    <button
                        className={activeTab === 'reviews' ? 'active' : ''}
                        onClick={() => setActiveTab('reviews')}
                        data-tab="reviews"
                    >
                        Reviews
                    </button>
                    <button
                        className={activeTab === 'comments' ? 'active' : ''}
                        onClick={() => setActiveTab('comments')}
                        data-tab="comments"
                    >
                        Comments
                    </button>
                </div>

                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                    <div className="reviews-section">
                        <form onSubmit={handleSubmitReview} className="new-review-form">
                            <h3><FaStar className="form-icon"/> Add Your Review</h3>
                            <div className="rating-selection">
                                <label>Your Rating:</label>
                                <StarRatings
                                    rating={newReview.rating}
                                    starRatedColor="#ffc107"
                                    changeRating={handleRatingClick}
                                    numberOfStars={5}
                                    name="new-rating"
                                    starDimension="25px"
                                    starSpacing="2px"
                                    starEmptyColor="#ddd"
                                    isHalf={true}
                                    isSelectable={true}
                                    starHoverColor="#ffc107"
                                />
                                {ratingError && <div className="error-tooltip">{ratingError}</div>}
                            </div>
                            <div className="feedback-container">
                                <label htmlFor="feedback">Your Comments (optional):</label>
                                <textarea
                                    id="feedback"
                                    placeholder="Write your feedback here..."
                                    value={newReview.feedback}
                                    onChange={(e) => setNewReview({...newReview, feedback: e.target.value})}
                                    rows="4"
                                />
                            </div>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmittingReview}
                            >
                                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>

                        <div className="reviews-list">
                            <div className="reviews-list-header-row">
                                <h3>All Reviews</h3>
                                <div className="review-sort-toggle">
                                    <button
                                        className={`sort-btn ${sortOrder === 'latest' ? 'active' : ''}`}
                                        onClick={() => setSortOrder('latest')}
                                    >
                                        <FaArrowDown/> Latest
                                    </button>
                                    <button
                                        className={`sort-btn ${sortOrder === 'oldest' ? 'active' : ''}`}
                                        onClick={() => setSortOrder('oldest')}
                                    >
                                        <FaArrowUp/> Oldest
                                    </button>
                                </div>
                            </div>

                            {getSortedReviews().length > 0 ? (
                                getSortedReviews().map((review, index) => (
                                    <div key={index} className="review-card-table rating">
                                        <div className="review-table-header">
                                            <div className="review-table-user">
                                                <strong>{review.student.name}</strong>
                                                <small>{review.student.email}</small>
                                            </div>
                                            <div className="review-table-date">
                                                {new Date(review.date).toLocaleString()}
                                                {studentEmail === review.student.email && (
                                                    <button className="review-table-delete-btn"
                                                            onClick={() => handleDeleteButton(review.id)}>
                                                        <FaTrash/>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="review-table-body">
                                            <p>{review.commentBody}</p>
                                        </div>

                                        <div className="review-table-actions">

                                        </div>
                                    </div>


                                ))
                            ) : (
                                <p className="no-reviews">No reviews yet. Be the first to review!</p>
                            )}
                        </div>
                    </div>
                )}

                {/* COMMENTS TAB */}
                {activeTab === 'comments' && (
                    <div className="comments-section">
                        <form onSubmit={handleSubmitComment} className="new-review-form">
                            <h3><FaCommentAlt className="form-icon"/> Ask a question or express your opinion!</h3>
                            <div className="feedback-container">
                                <textarea
                                    id="commentFeedback"
                                    placeholder="Write your comment here..."
                                    value={commentFeedback}
                                    onChange={(e) => setCommentFeedback(e.target.value)}
                                    rows="6"
                                />
                                {commentError && <div className="error-tooltip">{commentError}</div>}
                            </div>

                            <div className="file-upload-container">
                                <label htmlFor="file-upload" className="custom-upload-label">
                                    <FiUpload size={20}/>
                                    {selectedFiles.length > 0
                                        ? `${selectedFiles.length} file(s) selected`
                                        : "Attach files"}
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.png,.jpeg,.gif"
                                    onChange={handleFileChange}
                                    multiple
                                    style={{display: "none"}}
                                />
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="selected-files-list">
                                    <div className="selected-files-header">
                                        <span>Selected files</span>
                                        <span className="file-count">{selectedFiles.length} file(s)</span>
                                    </div>
                                    <ul>
                                        {selectedFiles.map((file, idx) => (
                                            <li key={idx} className="selected-file-item">
                                                <div className="file-info">
                                                    <FaFilePdf className="file-icon"/>
                                                    <span className="file-name">{file.name}</span>
                                                </div>
                                                <button
                                                    className="remove-file-btn"
                                                    onClick={() => handleRemoveFile(idx)}
                                                    title="Remove file"
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="submit-btn blue-theme"
                                disabled={isSubmittingComment}
                            >
                                {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
                            </button>
                        </form>

                        <div className="comments-list">
                            <div className={"reviews-list-header-row mt-5"}>
                                <h3>All Comments</h3>
                                <div className="review-sort-toggle">
                                    <button
                                        className={`sort-btn ${sortOrder === 'latest' ? 'active' : ''}`}
                                        onClick={() => setSortOrder('latest')}
                                    >
                                        <FaArrowDown/> Latest
                                    </button>
                                    <button
                                        className={`sort-btn ${sortOrder === 'oldest' ? 'active' : ''}`}
                                        onClick={() => setSortOrder('oldest')}
                                    >
                                        <FaArrowUp/> Oldest
                                    </button>
                                </div>
                            </div>

                            {getSortedComments() && getSortedComments().length > 0 ? (
                                getSortedComments().map((comment, index) => (
                                    <div key={index} className="review-card-table">
                                        <div className="review-table-header">
                                            <div className="review-table-user">
                                                <strong>{comment.student.name}</strong>
                                                <small>{comment.student.email}</small>
                                            </div>
                                            <div className="review-table-date">
                                                {new Date(comment.date).toLocaleString()}
                                                {studentEmail === comment.student.email && (
                                                    <button
                                                        className="review-table-delete-btn"
                                                        onClick={() => handleDeleteButton(comment.id)}
                                                    >
                                                        <FaTrash/>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <button onClick={() => toggleAttachments(comment.id)}
                                                className={"view-attachments-button"}>
                                            {expandedComments.has(comment.id) ? 'Hide Attachments' : 'Show Attachments'}
                                        </button>

                                        {expandedComments.has(comment.id) && (
                                            attachmentsMap[comment.id]?.length > 0 ? (
                                                <ul className="attachments-list">
                                                    {attachmentsMap[comment.id].map((att) => (
                                                        <li key={att.id} className="attachment-item">
                                                            <div className="attachment-details">
                                                                <FaFilePdf size={24} color="#ff6f61"/>
                                                                <a
                                                                    href={att.fileUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="attachment-link"
                                                                >
                                                                    {att.originalFileName}
                                                                </a>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="no-attachments">No attachments available for this
                                                    comment.</p>
                                            )
                                        )}

                                        <div className="review-table-body">
                                            <p>{comment.commentBody}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No comments yet. Start a conversation!</p>
                            )}
                        </div>
                    </div>

                )}
            </div>
        </>
    );
};

export default CourseReviewPage;
