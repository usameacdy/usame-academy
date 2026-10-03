const express = require('express');
const {
    getPromotions,
    getManagePromotions,
    createPromotion,
    deletePromotion,
    togglePromotion
} = require('../controllers/promotionController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', getPromotions);
router.get('/manage', protect, authorize('admin'), getManagePromotions);
router.post('/', protect, authorize('admin'), upload.single('promo_media'), createPromotion);
router.delete('/:id', protect, authorize('admin'), deletePromotion);
router.patch('/:id/toggle', protect, authorize('admin'), togglePromotion);

module.exports = router;
