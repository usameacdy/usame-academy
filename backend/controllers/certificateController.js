const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// @desc    Generate Certificate
// @route   POST /api/certificates/:resultId
exports.generateCertificate = async (req, res) => {
    const resultId = req.params.resultId;

    try {
        // Get result, student, and course info
        const resultQuery = await db.query(`
      SELECT r.*, u.name as student_name, c.title as course_title, c.id as course_id
      FROM results r
      JOIN users u ON r.student_id = u.id
      JOIN exams e ON r.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE r.id = $1 AND r.student_id = $2 AND r.passed = true
    `, [resultId, req.user.id]);

        if (resultQuery.rows.length === 0) {
            return res.status(404).json({ message: 'Passing result not found' });
        }

        const info = resultQuery.rows[0];
        const verificationCode = uuidv4().substring(0, 8).toUpperCase();
        const fileName = `cert_${info.student_id}_${info.course_id}.pdf`;
        const filePath = path.join(__dirname, '../uploads/certificates', fileName);

        // Ensure directory exists
        if (!fs.existsSync(path.join(__dirname, '../uploads/certificates'))) {
            fs.mkdirSync(path.join(__dirname, '../uploads/certificates'), { recursive: true });
        }

        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Design
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f9fafb');
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#1e40af');

        doc.fontSize(40).fillColor('#1e40af').text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });
        doc.fontSize(20).fillColor('#374151').text('This is to certify that', 0, 180, { align: 'center' });
        doc.fontSize(35).fillColor('#111827').text(info.student_name, 0, 220, { align: 'center' });
        doc.fontSize(20).fillColor('#374151').text('has successfully completed the course', 0, 280, { align: 'center' });
        doc.fontSize(25).fillColor('#1e40af').text(info.course_title, 0, 320, { align: 'center' });
        const issueDate = info.taken_at || info.created_at || new Date();
        doc.fontSize(15).fillColor('#6b7280').text(`Date: ${new Date(issueDate).toLocaleDateString()}`, 0, 380, { align: 'center' });
        doc.fontSize(12).text(`Verification ID: ${verificationCode}`, 0, 410, { align: 'center' });

        // QR Code
        const qrData = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify/${verificationCode}`;
        const qrImage = await QRCode.toDataURL(qrData);
        doc.image(qrImage, doc.page.width / 2 - 50, 450, { width: 100 });

        doc.end();

        stream.on('finish', async () => {
            try {
                // Save to DB
                await db.query(
                    'INSERT INTO certificates (student_id, course_id, certificate_url, verification_code) VALUES ($1, $2, $3, $4)',
                    [info.student_id, info.course_id, `/uploads/certificates/${fileName}`, verificationCode]
                );
                res.json({ url: `/uploads/certificates/${fileName}`, verificationCode });
            } catch (dbErr) {
                console.error('Certificate DB Error:', dbErr);
                res.status(500).json({ message: 'Shahaadada waa la soo saaray laakiin database-ka laguma qorin.' });
            }
        });

        stream.on('error', (err) => {
            console.error('PDF Stream Error:', err);
            res.status(500).json({ message: 'Error writing certificate file.' });
        });

    } catch (error) {
        console.error('Certificate Generation Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin Issue Certificate
// @route   POST /api/certificates/issue/:resultId
exports.issueCertificate = async (req, res) => {
    const resultId = req.params.resultId;
    const { mother_name } = req.body;
    let student_picture_path = null;

    if (req.file) {
        student_picture_path = '/uploads/students/' + req.file.filename;
    }

    try {
        // Get result, student, and course info
        const resultQuery = await db.query(`
      SELECT r.*, u.id as student_id, u.name as student_name, c.title as course_title, c.id as course_id
      FROM results r
      JOIN users u ON r.student_id = u.id
      JOIN exams e ON r.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE r.id = $1 AND r.passed = true
    `, [resultId]);

        // Ownership Check: Admin can issue for anyone, Instructor only for their courses
        if (req.user.role === 'instructor') {
            const courseCheck = await db.query(`
                SELECT c.instructor_id 
                FROM results r 
                JOIN exams e ON r.exam_id = e.id 
                JOIN courses c ON e.course_id = c.id 
                WHERE r.id = $1
            `, [resultId]);
            
            if (courseCheck.rows.length === 0 || courseCheck.rows[0].instructor_id !== req.user.id) {
                return res.status(403).json({ message: 'Ma haysatid ogolaansho aad shahaado ugu bixiso koorsadan.' });
            }
        }

        const info = resultQuery.rows[0];

        // Ensure the student hasn't already received a certificate for this result
        const existingCert = await db.query('SELECT * FROM certificates WHERE student_id = $1 AND course_id = $2', [info.student_id, info.course_id]);
        if (existingCert.rows.length > 0) {
            return res.status(400).json({ message: 'Ardaygan horey ayaa shahaado loo siiyay koorsadan.', certificate: existingCert.rows[0] });
        }

        const verificationCode = uuidv4().substring(0, 8).toUpperCase();
        const fileName = `cert_${info.student_id}_${info.course_id}_${Date.now()}.pdf`;
        const dirPath = path.join(__dirname, '../uploads/certificates');
        const filePath = path.join(dirPath, fileName);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // ─── PREMIUM DESIGN BACKGROUND ───────────────────
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');
        
        // Background Decorative Patterns (Subtle)
        doc.fillColor('#eff6ff');
        doc.circle(0, 0, 300).fill();
        doc.circle(doc.page.width, doc.page.height, 200).fill();

        // Main Border
        doc.lineWidth(15);
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke('#1e3a8a');
        
        // Inner Accent Border
        doc.lineWidth(2);
        doc.rect(45, 45, doc.page.width - 90, doc.page.height - 90).stroke('#3b82f6');

        // corner shapes
        doc.fillColor('#1e3a8a');
        doc.rect(30,30,50,50).fill();
        doc.rect(doc.page.width-80,30,50,50).fill();
        doc.rect(30,doc.page.height-80,50,50).fill();
        doc.rect(doc.page.width-80,doc.page.height-80,50,50).fill();

        // ─── HEADER ──────────────────────────────────────
        doc.font('Helvetica-Bold').fontSize(50).fillColor('#1e3a8a').text('SHAHAADADA GUUSHA', 0, 100, { align: 'center', characterSpacing: 2 });
        doc.font('Helvetica').fontSize(14).fillColor('#64748b').text('CERTIFICATE OF ACHIEVEMENT', 0, 155, { align: 'center', characterSpacing: 4 });

        doc.moveTo(200, 180).lineTo(doc.page.width - 200, 180).lineWidth(1).stroke('#e2e8f0');

        // ─── STUDENT PICTURE ─────────────────────────────
        const picX = 80;
        const picY = 220;
        if (req.file) {
            const relativePicPath = student_picture_path.startsWith('/') ? student_picture_path.substring(1) : student_picture_path;
            const picPath = path.join(__dirname, '..', relativePicPath);
            
            if (fs.existsSync(picPath)) {
                doc.save();
                doc.circle(picX + 60, picY + 60, 60).clip();
                doc.image(picPath, picX, picY, { width: 120, height: 120 });
                doc.restore();
                doc.circle(picX + 60, picY + 60, 60).lineWidth(4).stroke('#3b82f6');
            }
        }

        // ─── MAIN CONTENT ────────────────────────────────
        doc.font('Helvetica').fontSize(18).fillColor('#475569').text('Waxaan halkan ku xaqiijinaynaa in', 0, 210, { align: 'center' });
        doc.font('Helvetica-Bold').fontSize(42).fillColor('#111827').text(info.student_name, 0, 245, { align: 'center' });
        
        let contentY = 305;
        if (mother_name) {
            doc.font('Helvetica').fontSize(16).fillColor('#64748b').text(`Ina ${mother_name}`, 0, contentY, { align: 'center' });
            contentY += 30;
        }

        doc.font('Helvetica').fontSize(18).fillColor('#475569').text('uu si guul leh u dhamaystay koorsada', 0, contentY, { align: 'center' });
        contentY += 35;
        doc.font('Helvetica-Bold').fontSize(32).fillColor('#1e3a8a').text(info.course_title, 0, contentY, { align: 'center' });
        contentY += 60;

        // SEAL
        const sealX = doc.page.width / 2;
        const sealY = contentY + 20;
        doc.fillColor('#f8fafc').circle(sealX, sealY, 45).fillAndStroke('#f1f5f9', '#3b82f6');
        doc.fontSize(10).fillColor('#3b82f6').font('Helvetica-Bold').text('OFFICIAL', sealX - 45, sealY - 15, { width: 90, align: 'center' });
        doc.fontSize(12).text('EduFlow', sealX - 45, sealY, { width: 90, align: 'center' });
        doc.fontSize(10).text('SEAL', sealX - 45, sealY + 15, { width: 90, align: 'center' });

        // ─── FOOTER ──────────────────────────────────────
        const footerY = doc.page.height - 130;
        doc.font('Helvetica').fontSize(12).fillColor('#64748b').text('Taariikhda Issuing:', 80, footerY);
        doc.font('Helvetica-Bold').fillColor('#1e293b').text(new Date().toLocaleDateString(), 80, footerY + 15);
        doc.font('Helvetica').fontSize(12).fillColor('#64748b').text('ID-ga Shahaadada:', 80, footerY + 45);
        doc.font('Helvetica-Bold').fillColor('#1e293b').text(verificationCode, 80, footerY + 60);

        doc.font('Helvetica-Bold').fontSize(16).fillColor('#1e293b').text('Usaame Ismail', doc.page.width - 280, footerY + 15, { align: 'center', width: 200 });
        doc.moveTo(doc.page.width - 280, footerY + 35).lineTo(doc.page.width - 80, footerY + 35).lineWidth(1).stroke('#cbd5e1');
        doc.font('Helvetica').fontSize(12).fillColor('#64748b').text('Managing Director', doc.page.width - 280, footerY + 45, { align: 'center', width: 200 });

        // ─── QR CODE ─────────────────────────────────────
        const qrData = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify/${verificationCode}`;
        const qrImage = await QRCode.toDataURL(qrData, { margin: 1, color: { dark: '#1e3a8a', light: '#ffffff' } });
        doc.image(qrImage, doc.page.width / 2 - 40, doc.page.height - 110, { width: 80 });

        doc.end();

        stream.on('finish', async () => {
            try {
                // Save to DB
                const certRes = await db.query(
                    'INSERT INTO certificates (student_id, course_id, certificate_url, verification_code) VALUES ($1, $2, $3, $4) RETURNING *',
                    [info.student_id, info.course_id, `/uploads/certificates/${fileName}`, verificationCode]
                );
                
                // Mark request as approved if exists
                await db.query('UPDATE certificate_requests SET status = $1 WHERE result_id = $2', ['approved', resultId]);

                res.status(201).json({ 
                    message: 'Shahaadada si guul ah ayaa loo abuuray!', 
                    certificate: certRes.rows[0]
                });
            } catch (dbErr) {
                console.error('Issue Certificate DB Error:', dbErr);
                res.status(500).json({ message: 'Shahaadada waa la diyaariyay laakiin database-ka laguma keydin.' });
            }
        });

        stream.on('error', (err) => {
            console.error('Issue PDF Stream Error:', err);
            res.status(500).json({ message: 'Cillad ayaa ku timid qorista faylka shahaadada.' });
        });

    } catch (error) {
        console.error('Issue Certificate Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my certificates (Student)
// @route   GET /api/certificates/my-certificates
exports.getMyCertificates = async (req, res) => {
    try {
        const query = `
            SELECT cert.*, c.title as course_title, c.thumbnail_url
            FROM certificates cert
            JOIN courses c ON cert.course_id = c.id
            WHERE cert.student_id = $1
            ORDER BY cert.issued_at DESC
        `;
        const result = await db.query(query, [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify certificate (Public)
// @route   GET /api/certificates/verify/:code
exports.verifyCertificate = async (req, res) => {
    try {
        const query = `
            SELECT cert.*, u.name as student_name, c.title as course_title
            FROM certificates cert
            JOIN users u ON cert.student_id = u.id
            JOIN courses c ON cert.course_id = c.id
            WHERE cert.verification_code = $1
        `;
        const result = await db.query(query, [req.params.code]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Shahaadadan ma ahan mid sax ah (Invalid Certificate)' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request Certificate (Student)
// @route   POST /api/certificates/request/:resultId
exports.requestCertificate = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM results WHERE id = $1 AND student_id = $2 AND passed = true', [req.params.resultId, req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Passing result not found' });

        const exam = await db.query('SELECT course_id FROM exams WHERE id = $1', [result.rows[0].exam_id]);
        
        await db.query(
            'INSERT INTO certificate_requests (result_id, student_id, course_id) VALUES ($1, $2, $3) ON CONFLICT (result_id) DO NOTHING',
            [req.params.resultId, req.user.id, exam.rows[0].course_id]
        );

        res.json({ message: 'Shahaadada si guul ah ayaad u codsatay! Macalinku dhakhso ayuu kuugu soo jawaabi doonaa.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get certificate requests (Instructor/Admin)
// @route   GET /api/certificates/requests
exports.getCertificateRequests = async (req, res) => {
    try {
        let queryStr = `
            SELECT cr.*, u.name as student_name, c.title as course_title, r.score, r.id as result_id
            FROM certificate_requests cr
            JOIN users u ON cr.student_id = u.id
            JOIN courses c ON cr.course_id = c.id
            JOIN results r ON cr.result_id = r.id
            WHERE cr.status = 'pending'
        `;
        let params = [];

        if (req.user.role === 'instructor') {
            queryStr += ' AND c.instructor_id = $1';
            params.push(req.user.id);
        }

        const result = await db.query(queryStr, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
