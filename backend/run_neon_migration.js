const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_pTWjctHd7K6q@ep-broad-unit-b4lo1xzy.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    console.log('Connecting to Neon DB...');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        console.log('1. Altering users table...');
        await client.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_fee DECIMAL(10, 2) DEFAULT 0.00;
        `);

        console.log('2. Updating user passwords...');
        const pass123 = await bcrypt.hash('password123', 10);
        const passAdmin = await bcrypt.hash('Admin@2026', 10);
        const passUsaame = await bcrypt.hash('usaame12345', 10);

        await client.query(`UPDATE users SET password = $1 WHERE email = 'instructor@eduflow.com'`, [pass123]);
        await client.query(`UPDATE users SET password = $1 WHERE email = 'student@eduflow.com'`, [pass123]);
        await client.query(`UPDATE users SET password = $1 WHERE email = 'admin@usamacademy.com'`, [passAdmin]);
        await client.query(`UPDATE users SET password = $1 WHERE email = 'jokarkaamusan@gmail.com'`, [passUsaame]);

        console.log('3. Altering lessons table...');
        await client.query(`
            ALTER TABLE lessons ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);
        `);

        console.log('4. Altering enrollments table...');
        await client.query(`
            ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
            UPDATE enrollments SET status = 'active' WHERE status IS NULL;
        `);

        console.log('5. Creating promotions table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS promotions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                type VARCHAR(20) DEFAULT 'image',
                media_url VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                link_url VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('6. Creating assignments & submissions table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS assignments (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                due_date TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS submissions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
                student_id UUID REFERENCES users(id) ON DELETE CASCADE,
                submission_text TEXT,
                file_url VARCHAR(255),
                grade VARCHAR(10),
                feedback TEXT,
                submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('7. Creating certificate_requests table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS certificate_requests (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                result_id UUID REFERENCES results(id) ON DELETE CASCADE,
                student_id UUID REFERENCES users(id) ON DELETE CASCADE,
                course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(result_id)
            );
        `);

        console.log('8. Creating instructor_rentals table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS instructor_rentals (
                id SERIAL PRIMARY KEY,
                instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10,2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Check if assignments exist
        const aCount = await client.query('SELECT count(*) FROM assignments');
        if (parseInt(aCount.rows[0].count) === 0) {
            console.log('Adding sample assignments...');
            const reactCourse = await client.query("SELECT id FROM courses WHERE title LIKE '%React%'");
            if (reactCourse.rows.length > 0) {
                await client.query(`
                    INSERT INTO assignments (course_id, title, description, due_date)
                    VALUES ($1, 'Build a Todo App with Hooks', 'Create a clean Todo list component using useState and useEffect hooks.', NOW() + INTERVAL '7 days')
                `, [reactCourse.rows[0].id]);
            }
        }

        // Add lessons for UI/UX and Digital Marketing if none exist
        const uiCourse = await client.query("SELECT id FROM courses WHERE title LIKE '%UI/UX%'");
        if (uiCourse.rows.length > 0) {
            const uiLessons = await client.query('SELECT count(*) FROM lessons WHERE course_id = $1', [uiCourse.rows[0].id]);
            if (parseInt(uiLessons.rows[0].count) === 0) {
                console.log('Adding lessons for UI/UX course...');
                await client.query(`
                    INSERT INTO lessons (course_id, title, content, order_index, video_url) VALUES
                    ($1, 'Introduction to UI/UX Principles', 'Learn core design principles: hierarchy, contrast, balance and alignment.', 1, 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU'),
                    ($1, 'Figma Essentials & Auto-Layout', 'Mastering frames, components, and auto-layout in modern Figma.', 2, 'https://www.youtube.com/watch?v=HZuk6Wkx_Eg'),
                    ($1, 'Creating Interactive Prototypes', 'Building animated transitions and user flows for client presentations.', 3, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                `, [uiCourse.rows[0].id]);
            }
        }

        const mktCourse = await client.query("SELECT id FROM courses WHERE title LIKE '%Digital Marketing%'");
        if (mktCourse.rows.length > 0) {
            const mktLessons = await client.query('SELECT count(*) FROM lessons WHERE course_id = $1', [mktCourse.rows[0].id]);
            if (parseInt(mktLessons.rows[0].count) === 0) {
                console.log('Adding lessons for Digital Marketing course...');
                await client.query(`
                    INSERT INTO lessons (course_id, title, content, order_index, video_url) VALUES
                    ($1, 'Fundamentals of Digital Marketing', 'Understanding market research, customer avatars, and funnel stages.', 1, 'https://www.youtube.com/watch?v=bixR-KIJKYM'),
                    ($1, 'Search Engine Optimization (SEO)', 'Keyword research, on-page SEO, backlinks and Google search ranking.', 2, 'https://www.youtube.com/watch?v=xsVTqzratPs'),
                    ($1, 'Social Media Ads & Campaigns', 'Running high converting Meta and TikTok advertising campaigns.', 3, 'https://www.youtube.com/watch?v=2vpH1d3tH7A')
                `, [mktCourse.rows[0].id]);
            }
        }

        await client.query('COMMIT');
        console.log('✅ Neon DB Migration Completed Successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Migration Failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
