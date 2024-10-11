// script.js

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const teacherForm = document.getElementById('teacherForm');
const addMessage = document.getElementById('addMessage');
const viewTeachersBtn = document.getElementById('viewTeachers');
const teacherList = document.getElementById('teacherList');

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

// Admin login functionality
document.addEventListener('DOMContentLoaded', () => {
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                // Fetch login API
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Redirect to the add teacher page
                    window.location.href = 'add-teacher.html';
                } else {
                    loginMessage.textContent = data.message; // Show error message
                }
            } catch (error) {
                console.error('Error during login:', error);
                loginMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    // Handle teacher form submission
    if (teacherForm) {
        teacherForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('teacher-name').value;
            const position = document.getElementById('teacher-position').value;
            const salary = document.getElementById('teacher-salary').value;

            try {
                const response = await fetch('http://localhost:5000/api/teachers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, position, salary: Number(salary) }),
                });

                const newTeacher = await response.json();
                addMessage.textContent = `Successfully added ${newTeacher.name}.`;
                teacherForm.reset(); // Reset the form

            } catch (error) {
                console.error('Error adding teacher:', error);
                addMessage.textContent = 'Error adding teacher.';
            }
        });
    }

    // View Teachers Button functionality
    if (viewTeachersBtn) {
        viewTeachersBtn.addEventListener('click', () => {
            window.location.href = 'teachers.html';
        });
    }

    // Fetch all teachers for the teacher data page
    if (teacherList) {
        fetchTeachers();
    }
});

// Function to fetch all teachers
async function fetchTeachers() {
    try {
        const response = await fetch('http://localhost:5000/api/teachers');
        const teachers = await response.json();

        // Clear existing list
        teacherList.innerHTML = '';

        // Populate the teacher list
        teachers.forEach(teacher => {
            const li = document.createElement('li');
            li.textContent = `${teacher.name} - ${teacher.position} - $${teacher.salary}`;
            teacherList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching teachers:', error);
    }
}
