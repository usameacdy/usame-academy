-- EduFlow LMS Seed Data
-- -------------------------------------------------------------
-- Instructions: 
-- 1. Run database.sql first to create tables.
-- 2. Run this file to populate with premium sample data.
-- -------------------------------------------------------------

-- 1. CLEAN UP (Optional: Uncomment to reset)
DELETE FROM progress; DELETE FROM results; DELETE FROM enrollments; DELETE FROM questions; DELETE FROM exams; DELETE FROM lessons; DELETE FROM courses; DELETE FROM users;

-- 2. USERS (Password for all: password123 except Admin)
-- Admin Hash generated for 'usaame12345': $2b$10$0Q8DXdSvEkdgR3sbHbVfJ.u2W0GO/6LnJ6GVI7p2U6t0Wj4ZzjupC
-- Instructor/Student Hash generated for 'password123': $2a$10$Ph94/AAn/v.gI8R3N2M.te4iGvS.g79JmNoq03iB7UuQ1/R1k5F1S
INSERT INTO users (name, email, password, role) VALUES 
('Usaame Admin', 'jokarkaamusan@gmail.com', '$2b$10$0Q8DXdSvEkdgR3sbHbVfJ.u2W0GO/6LnJ6GVI7p2U6t0Wj4ZzjupC', 'admin'),
('Dr. Sarah Wilson', 'instructor@eduflow.com', '$2a$10$Ph94/AAn/v.gI8R3N2M.te4iGvS.g79JmNoq03iB7UuQ1/R1k5F1S', 'instructor'),
('Usaame Student', 'student@eduflow.com', '$2a$10$Ph94/AAn/v.gI8R3N2M.te4iGvS.g79JmNoq03iB7UuQ1/R1k5F1S', 'student');

-- 3. COURSES
INSERT INTO courses (title, description, price, instructor_id, thumbnail_url, is_published, category) VALUES 
('Mastering React & Next.js', 'Go from zero to hero with the most popular web framework in the world. Includes 20 projects.', 49.99, (SELECT id FROM users WHERE email='instructor@eduflow.com'), '/uploads/react-premium.jpg', true, 'Web Development'),
('UI/UX Design Masterclass', 'Learn Figma, principle of design, and how to build stunning user interfaces.', 35.00, (SELECT id FROM users WHERE email='instructor@eduflow.com'), '/uploads/design-premium.jpg', true, 'Design'),
('Digital Marketing Pro', 'Master SEO, Social Media Marketing, and Paid Ads with real-world case studies.', 25.00, (SELECT id FROM users WHERE email='instructor@eduflow.com'), '/uploads/marketing-premium.jpg', true, 'Marketing');

-- 4. LESSONS (Mastering React)
INSERT INTO lessons (course_id, title, content, order_index, video_url) VALUES 
((SELECT id FROM courses WHERE title='Mastering React & Next.js'), 'Introduction to the Course', 'In this lesson, we will go over the syllabus and setup our environment.', 1, 'https://www.youtube.com/watch?v=Ke90Tje7VS0'),
((SELECT id FROM courses WHERE title='Mastering React & Next.js'), 'React Fundamentals', 'Understanding components, props, and state management in React.', 2, 'https://www.youtube.com/watch?v=SqcY0GlETPk'),
((SELECT id FROM courses WHERE title='Mastering React & Next.js'), 'Hooks Deep Dive', 'Learning how to use useEffect, useContext, and useMemo effectively.', 3, 'https://www.youtube.com/watch?v=LlvBzyy-558');

-- 5. EXAMS
INSERT INTO exams (course_id, title, passing_score, duration_minutes) VALUES 
((SELECT id FROM courses WHERE title='Mastering React & Next.js'), 'React Certification Exam', 70, 30);

-- 6. QUESTIONS
INSERT INTO questions (exam_id, question_text, options, correct_option) VALUES 
((SELECT id FROM exams WHERE title='React Certification Exam'), 'What is the primary use of the useState hook?', '{"A": "Fetching data", "B": "Managing local state", "C": "Performance optimization", "D": "Styling components"}', 'B'),
((SELECT id FROM exams WHERE title='React Certification Exam'), 'Which lifecycle method is equivalent to useEffect with an empty dependency array?', '{"A": "componentDidUpdate", "B": "componentWillUnmount", "C": "componentDidMount", "D": "render"}', 'C'),
((SELECT id FROM exams WHERE title='React Certification Exam'), 'What does JSX stands for?', '{"A": "JavaScript XML", "B": "Java syntax extension", "C": "JSON XML", "D": "None of the above"}', 'A');

-- 7. MOCK ENROLLMENT (Student already enrolled in React)
INSERT INTO enrollments (student_id, course_id) VALUES 
((SELECT id FROM users WHERE email='student@eduflow.com'), (SELECT id FROM courses WHERE title='Mastering React & Next.js'));
