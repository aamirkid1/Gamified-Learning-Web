const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/enrollment`;

const enrollmentService = {
  async enroll(studentId, courseId) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        courseId,
      }),
    });

    return response.json();
  },

  async getStudentEnrollments(studentId) {
    const response = await fetch(`${API_URL}/student/${studentId}`);
    return response.json();
  },

  async getEnrollmentCount(courseId) {
    const response = await fetch(
      `${API_URL}/course/${courseId}/count`
    );

    return response.json();
  },
};

export default enrollmentService;