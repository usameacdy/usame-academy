const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = './uploads/courses';
        if (file.fieldname === 'profile_picture') {
            uploadPath = './uploads/students';
        } else if (file.fieldname === 'video') {
            uploadPath = './uploads/videos';
        } else if (file.fieldname === 'pdf') {
            uploadPath = './uploads/resources';
        } else if (file.fieldname === 'image') {
            uploadPath = './uploads/lesson_images';
        } else if (file.fieldname === 'promo_media') {
            uploadPath = './uploads/promotions';
        }
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|mp4|mov|avi|mkv|wmv|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype || extname) {
            return cb(null, true);
        }
        cb(new Error('Only images, videos, and PDFs are allowed!'));
    },
});

module.exports = upload;
