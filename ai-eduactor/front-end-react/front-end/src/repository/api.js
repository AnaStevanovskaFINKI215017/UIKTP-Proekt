import axios from 'axios';

const AUTH_BASE_URL = 'http://localhost:8080/auth';
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


