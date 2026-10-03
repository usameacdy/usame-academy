const db = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe Payment Intent
// @route   POST /api/payments/stripe/create-intent
exports.createStripeIntent = async (req, res) => {
    const { course_id } = req.body;

    try {
        const course = await db.query('SELECT * FROM courses WHERE id = $1', [course_id]);
        if (course.rows.length === 0) return res.status(404).json({ message: 'Course not found' });

        const amountInCents = Math.round(course.rows[0].price * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            metadata: { student_id: req.user.id, course_id },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Process Mock Local Payment (Zaad/EVC)
// @route   POST /api/payments/local/mock
exports.processLocalPayment = async (req, res) => {
    const { course_id, phone_number, provider } = req.body;

    try {
        const course = await db.query('SELECT * FROM courses WHERE id = $1', [course_id]);
        if (course.rows.length === 0) return res.status(404).json({ message: 'Course not found' });

        // Simulate payment processing delay
        // In real world, this would call a local gateway API
        const transaction_id = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Create payment record
        await db.query(
            'INSERT INTO payments (student_id, course_id, amount, status, provider, transaction_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [req.user.id, course_id, course.rows[0].price, 'completed', provider, transaction_id]
        );

        // Enroll student automatically
        await db.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.user.id, course_id]
        );

        res.json({ message: 'Payment successful and enrolled', transaction_id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Revenue Analytics (Admin)
// @route   GET /api/payments/revenue
exports.getRevenueAnalytics = async (req, res) => {
    try {
        // Query Total Revenue
        const totalQuery = await db.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'");
        const totalRevenue = parseFloat(totalQuery.rows[0].total);

        // Monthly Breakdown
        const monthlyQuery = await db.query(`
            SELECT 
                TO_CHAR(created_at, 'YYYY-MM') as month, 
                COUNT(*) as sales_count,
                SUM(amount) as revenue
            FROM payments 
            WHERE status = 'completed'
            GROUP BY TO_CHAR(created_at, 'YYYY-MM')
            ORDER BY month ASC
        `);
        const monthlyData = monthlyQuery.rows;

        // Recent Transactions
        const recentQuery = await db.query(`
            SELECT p.id, p.amount, p.provider, p.status, p.created_at,
                   u.name as student_name, c.title as course_title
            FROM payments p
            JOIN users u ON p.student_id = u.id
            JOIN courses c ON p.course_id = c.id
            WHERE p.status = 'completed'
            ORDER BY p.created_at DESC
            LIMIT 20
        `);
        const recentTransactions = recentQuery.rows;

        res.json({
            totalRevenue,
            monthlyData,
            recentTransactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        await db.query('DELETE FROM payments WHERE id = $1', [req.params.id]);
        res.json({ message: 'Diiwaanka lacagta waa la tirtiray' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit Rent Payment (Instructor)
// @route   POST /api/payments/rent/submit
exports.submitRentPayment = async (req, res) => {
    const { amount, payment_method } = req.body;
    try {
        await db.query(`
            INSERT INTO instructor_rentals (instructor_id, amount, payment_method, status)
            VALUES ($1, $2, $3, 'pending')
        `, [req.user.id, amount, payment_method]);
        res.json({ message: 'Rent payment submitted successfully. Waiting for admin approval.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Rental Requests (Admin)
// @route   GET /api/payments/rent/requests
exports.getRentalRequests = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.*, u.name as instructor_name, u.email
            FROM instructor_rentals r
            JOIN users u ON r.instructor_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve Rent (Admin)
// @route   PUT /api/payments/rent/approve/:id
exports.approveRentPayment = async (req, res) => {
    try {
        const rentUpdate = await db.query(`
            UPDATE instructor_rentals SET status = 'approved'
            WHERE id = $1 RETURNING instructor_id
        `, [req.params.id]);

        if (rentUpdate.rows.length > 0) {
            await db.query('UPDATE users SET is_locked = false WHERE id = $1', [rentUpdate.rows[0].instructor_id]);
        }
        res.json({ message: 'Rent approved and instructor unlocked' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
