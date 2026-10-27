const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres:1122@localhost:5432/eduflow' });

async function migrateLocal() {
    try {
        console.log('Migrating local DB...');
        await pool.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_fee DECIMAL(10, 2) DEFAULT 0.00;
            ALTER TABLE lessons ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);
            ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
            UPDATE enrollments SET status = 'active' WHERE status IS NULL;

            CREATE TABLE IF NOT EXISTS promotions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                type VARCHAR(20) DEFAULT 'image',
                media_url VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                link_url VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

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

            CREATE TABLE IF NOT EXISTS certificate_requests (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                result_id UUID REFERENCES results(id) ON DELETE CASCADE,
                student_id UUID REFERENCES users(id) ON DELETE CASCADE,
                course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(result_id)
            );

            CREATE TABLE IF NOT EXISTS instructor_rentals (
                id SERIAL PRIMARY KEY,
                instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10,2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Local DB Migrations successfully applied!');
    } catch(e) {
        console.error('Local DB Migration error:', e.message);
    } finally {
        await pool.end();
    }
}
migrateLocal();
