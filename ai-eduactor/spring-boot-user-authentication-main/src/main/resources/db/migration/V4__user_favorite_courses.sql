CREATE TABLE user_favorite_courses (
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, course_id),
    CONSTRAINT fk_user_favorite_courses_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_favorite_courses_course FOREIGN KEY (course_id)
        REFERENCES courses(id) ON DELETE CASCADE
);