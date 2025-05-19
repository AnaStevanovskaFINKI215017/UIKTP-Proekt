import axios from 'axios';

export const AUTH_BASE_URL = 'http://localhost:8080/auth';
export const API_URL = 'http://localhost:8080/api';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${AUTH_BASE_URL}/login`, {email, password});
        if (response.status === 200) {
            const {token, email, name, role} = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            localStorage.setItem("name", name);
            localStorage.setItem("role", role);
            document.cookie = `jwt=${token}; path=/`;
        }
    } catch (err) {
        console.log("Error while logging in", err);
        throw err;
    }
};

export const registerUser = async (name, email, password) => {
    try {
        await axios.post(
            `${AUTH_BASE_URL}/register`,
            {name, email, password},
            {headers: {"Content-Type": "application/json"}}
        );
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await axios.post(`${AUTH_BASE_URL}/logout`, {}, {
            withCredentials: true
        });

        document.cookie = "jwt=; Max-Age=0; path=/";
        localStorage.clear();
    } catch (error) {
        console.error('Error during logout:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const deleteSemester = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/semesters/${id}`, {
            withCredentials: true
        });

        if (response.status === 200) {
            console.log('Semester deleted successfully');
        } else {
            console.error('Failed to delete semester');
        }
    } catch (error) {
        console.error('Error deleting semester:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const getCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/courses`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const createCourse = async (courseData) => {
    try {
        const response = await axios.post(`${API_URL}/courses`, courseData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error creating course:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const updateCourse = async (id, courseData) => {
    try {
        console.log(courseData)
        const response = await axios.put(`${API_URL}/courses/${id}`, courseData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error updating course:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const deleteCourse = async (id) => {
    try {
        console.log("Attempting to delete course with ID:", id);
        const response = await axios.delete(`${API_URL}/courses/${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting course:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

// export const exportPDF = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/export/pdf`, {
//       responseType: 'arraybuffer',
//     });
//
//     const blob = new Blob([response.data], { type: 'application/pdf' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'data.pdf';
//     link.click();
//   } catch (error) {
//     console.error('Error exporting PDF:', error);
//     throw error;
//   }
// };

export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/files/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const importCourses = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/files/importCourses`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};


export const generateFlashCards = async (attachmentId, numFlashcards) => {
    try {
        const response = await axios.post(
            `${API_URL}/flashcards/generate?attachment_id=${attachmentId}&num_flashcards=${numFlashcards}`,
            {},
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const exportFlashCards = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/flashcards/export/${courseId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (err) {
        console.error(err);
        if (err.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw err;
    }
}

export const getFlashCardsByCourseAndUser = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/flashcards/forCourseAndUser/${courseId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const getFlashCardsByCourse = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/flashcards/forCourse/${courseId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const getSemesters = async (email, token) => {
    try {

        const response = await axios.get(`${API_URL}/semesters`, {
            withCredentials: true,
            params: {email}
        });

        console.log('Fetched semesters:', response.data);  // Log the response data
        return response.data;  // Make sure this is an array
    } catch (error) {
        console.error('Error fetching semesters:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};


export const createSemester = async (semesterData, email) => {
    try {
        const response = await axios.post(`${API_URL}/semesters/createOrUpdate?email=${email}`, semesterData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error creating semester:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const getCourseRecommendations = async (takenSubjects) => {
    try {
        const response = await axios.post(`${API_URL}/courses/recommend`, takenSubjects, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recommendations: " + error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};


export const submitSubjectReview = async (courseId, reviewData) => {
    try {
        const requests = [];

        const rating = parseInt(reviewData.rating);
        // Submit rating
        if (reviewData.rating) {
            requests.push(
                axios.post(`${API_URL}/courses/${courseId}/ratings`, {}, {
                    withCredentials: true,
                    params: {
                        ratingValue: rating
                    }
                })
            );
        }

        // Submit comment
        if (reviewData.feedback && reviewData.feedback.trim()) {
            console.log(reviewData.isReview)
            requests.push(
                axios.post(`${API_URL}/courses/${courseId}/comments/reviews`, {}, {
                    withCredentials: true,
                    params: {
                        commentBody: reviewData.feedback
                    }
                })
            );
        }

        await Promise.all(requests);
        return {success: true};
    } catch (error) {
        console.error('Error submitting review:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error.response?.data || error.message || 'Failed to submit review';
    }
};

export const submitSubjectComment = async (courseId, formData) => {
    console.log('POST COMMENT')
    try {
        return await axios.post(`${API_URL}/courses/${courseId}/comments`, formData, {
            withCredentials: true
        })
    } catch (error) {
        console.error('Error submitting review:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error.response?.data || error.message || 'Failed to submit review';
    }
};

export const getSubjectReviews = async (courseId) => {
    try {
        const [reviewsResponse, commentsResponse, ratingResponse] = await Promise.all([
            axios.get(`${API_URL}/courses/${courseId}/comments?forReviews=${true}`, {
                withCredentials: true
            }),
            axios.get(`${API_URL}/courses/${courseId}/comments?forReviews=${false}`, {
                withCredentials: true
            }),
            axios.get(`${API_URL}/courses/${courseId}/ratings/average`, {
                withCredentials: true
            })
        ]);

        // Logging both responses to make sure the structure is correct
        console.log('Comments:', commentsResponse.data);
        console.log('Reviews:', reviewsResponse.data);
        console.log('Average Rating:', ratingResponse.data);

        return {
            reviews: reviewsResponse.data,
            comments: commentsResponse.data,
            averageRating: ratingResponse.data
        };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const addCourseToFavorites = async (courseId) => {
    try {
        const email = localStorage.getItem('email');

        const response = await axios.put(`${API_URL}/courses/${courseId}/favorite/add`, {}, {
            withCredentials: true,
            params: {
                email: email
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const removeCourseFromFavorites = async (courseId) => {
    try {
        const email = localStorage.getItem('email');

        await axios.put(`${API_URL}/courses/${courseId}/favorite/remove`, {}, {
            withCredentials: true,
            params: {
                email: email
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const getFavoriteCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/courses/favorites`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const deleteComment = async (courseId, commentId) => {
    try {
        const email = localStorage.getItem('email');

        const response = await axios.delete(`${API_URL}/courses/${courseId}/comments/${commentId}`, {
            withCredentials: true,
            params: {
                email: email
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
}

export const fetchCommentAttachments = async (courseId, commentId) => {
    try {
        const response = await axios.get(`${API_URL}/courses/${courseId}/comments/${commentId}/attachments`, {
            withCredentials: true
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
}

export const deleteFlashCard = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/flashcards/${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting flashcard:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
};

export const getCourseAttachments = async (courseId) => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/attachments`, {
                withCredentials: true,
                params: {
                    courseId: courseId
                },

            });
        return res.data;
    } catch (error) {
        console.error("Error fetching course attachments:", error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
}

export const exportPdfFlashcards = async (attachmentId) => {
    try {
        console.log("IDDDD", attachmentId);
        const res = await axios.get(
            `http://localhost:8080/api/flashcards/export-for-attachment?attachment_id=${attachmentId}`, {
                withCredentials: true,
            });
        return res.data;
    } catch (error) {
        console.error("Error exporting pdf flashcards:", error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
}

export const uploadCourseAttachment = async (formData) => {
    try {
        const response = await axios.post('http://localhost:8080/api/attachments/upload', formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error during file upload:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
}

export const deleteAttachment = async (attachmentId) => {
    try {
        await axios.delete(`${API_URL}/attachments/${attachmentId}`, {
            withCredentials: true
        });
    } catch (error) {
        console.error('Error during deleting attachment:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
}

export const getFlashCardsForAttachment = async (attachmentId) => {
    try {
        const response = await axios.get(`${API_URL}/flashcards/forAttachment/${attachmentId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        if (error.response?.status === 403) {
            console.error("You are not authorized. Maybe session expired?");
            localStorage.clear();
            window.location.href = "/login";
        }
        throw error;
    }
}