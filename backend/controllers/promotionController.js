const { query } = require('../config/db');

// @desc    Get all active promotions
// @route   GET /api/promotions
// @access  Public
const getPromotions = async (req, res, next) => {
    try {
        const result = await query(
            'SELECT * FROM promotions WHERE is_active = TRUE ORDER BY created_at DESC'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
};

// @desc    Get all promotions (including inactive)
// @route   GET /api/promotions/manage
// @access  Private/Admin
const getManagePromotions = async (req, res, next) => {
    try {
        const result = await query(
            'SELECT * FROM promotions ORDER BY created_at DESC'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new promotion
// @route   POST /api/promotions
// @access  Private/Admin
const createPromotion = async (req, res, next) => {
    try {
        const { type, title, link_url } = req.body;
        const media_url = req.file ? `/uploads/promotions/${req.file.filename}` : null;

        if (!media_url) {
            return res.status(400).json({ message: 'Please upload a media file' });
        }

        const result = await query(
            'INSERT INTO promotions (type, media_url, title, link_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [type, media_url, title, link_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
const deletePromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM promotions WHERE id = $1', [id]);
        res.status(200).json({ message: 'Promotion removed' });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle promotion status
// @route   PATCH /api/promotions/:id/toggle
// @access  Private/Admin
const togglePromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await query(
            'UPDATE promotions SET is_active = NOT is_active WHERE id = $1 RETURNING *',
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPromotions,
    getManagePromotions,
    createPromotion,
    deletePromotion,
    togglePromotion
};
