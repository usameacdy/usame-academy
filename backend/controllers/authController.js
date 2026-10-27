const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({ message: 'Fadlan qor magacaaga oo buuxa.' });
    }

    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, phone',
            [name, email, hashedPassword, role || 'student', phone]
        );

        const user = newUser.rows[0];
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            token: generateToken(user.id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                is_locked: user.is_locked,
                monthly_fee: user.monthly_fee,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
exports.getUserProfile = async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, email, role, created_at, phone, is_locked, monthly_fee FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, email, role, created_at, phone, is_locked, monthly_fee FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile (Settings)
// @route   PUT /api/auth/profile
exports.updateUserProfile = async (req, res) => {
    const { name, phone, currentPassword, newPassword } = req.body;

    if (name && name.trim().split(/\s+/).length < 3) {
        return res.status(400).json({ message: 'Fadlan qor magacaaga oo saddexan si shahaadadu u dhammaystirnaato.' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update name and phone if provided
        let updatedName = name || user.name;
        let updatedPhone = phone || user.phone;

        // Update password if current and new passwords provided
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid current password' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await db.query('UPDATE users SET name = $1, phone = $2, password = $3 WHERE id = $4', [updatedName, updatedPhone, hashedPassword, req.user.id]);
        } else {
            await db.query('UPDATE users SET name = $1, phone = $2 WHERE id = $3', [updatedName, updatedPhone, req.user.id]);
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Prevent self-deletion
        if (userId === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete your own admin account.' });
        }

        // Delete user
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create instructor (Admin only)
// @route   POST /api/auth/instructor
exports.createInstructor = async (req, res) => {
    const { name, email, password, phone, monthly_fee } = req.body;
    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) return res.status(400).json({ message: 'User already exists' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await db.query(
            'INSERT INTO users (name, email, password, role, phone, monthly_fee) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, email, hashedPassword, 'instructor', phone, monthly_fee || 0]
        );
        res.status(201).json({ message: 'Instructor created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lock user (Admin only)
// @route   PUT /api/auth/users/:id/lock
exports.lockUser = async (req, res) => {
    try {
        await db.query('UPDATE users SET is_locked = true WHERE id = $1', [req.params.id]);
        res.json({ message: 'User locked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unlock user (Admin only)
// @route   PUT /api/auth/users/:id/unlock
exports.unlockUser = async (req, res) => {
    try {
        await db.query('UPDATE users SET is_locked = false WHERE id = $1', [req.params.id]);
        res.json({ message: 'User unlocked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Admin reset user password (Admin only)
// @route   PUT /api/auth/users/:id/reset-password
exports.adminResetPassword = async (req, res) => {
    const { newPassword } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.params.id]);
        res.json({ message: 'Password reset successfully by admin' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
