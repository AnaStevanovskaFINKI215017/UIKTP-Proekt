CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(255) NOT NULL,
                       index VARCHAR(255) NOT NULL
);

CREATE TABLE courses (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        description TEXT
);

CREATE TABLE semesters (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE semester_courses (
                        semester_id BIGINT REFERENCES semesters(id) ON DELETE CASCADE,
                        course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
                        PRIMARY KEY (semester_id, course_id)
);

CREATE TABLE flashcards (
                            id SERIAL PRIMARY KEY,
                            question VARCHAR(255) NOT NULL,
                            answer TEXT NOT NULL,
                            course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
                            attachment BYTEA
);
