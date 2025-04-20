import axios from 'axios';


export const AUTH_BASE_URL = 'http://localhost:8080/auth';
export const API_URL = 'http://localhost:8080/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
      const response = await axios.post(`${AUTH_BASE_URL}/register`, userData);
      return response.data;
  } catch (error) {
      console.error("Error during registration:", error);
      throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/logout`);
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};


export const getCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await axios.post(`${API_URL}/courses`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const response = await axios.put(`${API_URL}/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    console.log("Attempting to delete course with ID:", id);
    const response = await axios.delete(`${API_URL}/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
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
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const importCourses = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/files/importCourses`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};


export const getFlashCards = async () => {
  try {
    const response = await axios.get(`${API_URL}/flashcards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
};

export const createFlashCard = async (flashCardData) => {
  try {
    const response = await axios.post(`${API_URL}/flashcards`, flashCardData);
    return response.data;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
};


export const getSemesters = async () => {
  try {
    const response = await axios.get(`${API_URL}/semesters`);
    return response.data;
  } catch (error) {
    console.error('Error fetching semesters:', error);
    throw error;
  }
};

export const createSemester = async (semesterData) => {
  try {
    const response = await axios.post(`${API_URL}/semesters`, semesterData);
    return response.data;
  } catch (error) {
    console.error('Error creating semester:', error);
    throw error;
  }
};


export const submitSubjectReview = async (courseId, reviewData) => {
  try {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const requests = [];

    // Submit rating
    if (reviewData.rating) {
      requests.push(
          axios.post(`${API_URL}/courses/${courseId}/ratings`, {
            ratingValue: parseInt(reviewData.rating),
            studentEmail: email
          }, { headers })
      );
    }

    // Submit comment
    if (reviewData.feedback && reviewData.feedback.trim()) {
      requests.push(
          axios.post(`${API_URL}/courses/${courseId}/comments`, {
            commentBody: reviewData.feedback.trim(),
            studentEmail: email
          }, { headers })
      );
    }

    await Promise.all(requests);
    return { success: true };
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error.response?.data || error.message || 'Failed to submit review';
  }
};

export const submitSubjectComment = async (courseId, commentFeedback) => {
  try {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    if (commentFeedback && commentFeedback.trim()) {
      await axios.post(`${API_URL}/courses/${courseId}/comments`, {
        commentBody: commentFeedback.trim(),
        studentEmail: email
      }, {headers})
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error.response?.data || error.message || 'Failed to submit review';
  }
};

export const getSubjectReviews = async (courseId) => {
  try {
    const [commentsResponse, ratingResponse] = await Promise.all([
      axios.get(`${API_URL}/courses/${courseId}/comments`),
      axios.get(`${API_URL}/courses/${courseId}/ratings/average`)
    ]);

    // Logging both responses to make sure the structure is correct
    console.log('Comments:', commentsResponse.data);
    console.log('Average Rating:', ratingResponse.data);

    return {
      comments: commentsResponse.data,
      averageRating: ratingResponse.data
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const addCourseToFavorites = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.put(`${API_URL}/courses/${courseId}/favorite/add`, {}, {
      headers,
      params: {
        email: email
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const removeCourseFromFavorites = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    await axios.put(`${API_URL}/courses/${courseId}/favorite/remove`, {}, {
      headers,
      params: {
        email: email
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getFavoriteCourses = async () => {
  try{
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.get(`${API_URL}/courses/favorites`, {
      headers,
      params: {
        email: email
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const deleteComment = async (courseId, commentId) => {
  try {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Remove the empty object {} from the delete request, had an error with it
    const response = await axios.delete(`${API_URL}/courses/${courseId}/comments/${commentId}`, {
      headers,
      params: {
        email: email
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}