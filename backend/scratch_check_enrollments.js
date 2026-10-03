const db = require('./config/db');
(async () => {
    try {
        const res = await db.query("SELECT column_name, column_default, is_nullable FROM information_schema.columns WHERE table_name = 'enrollments'");
        console.log("SCHEMA:");
        console.log(JSON.stringify(res.rows, null, 2));
        
        const rows = await db.query("SELECT * FROM enrollments LIMIT 10");
        console.log("ROWS:");
        console.log(JSON.stringify(rows.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
})();
