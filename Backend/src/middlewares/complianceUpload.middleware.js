const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (_req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only PDF, JPG, PNG, and WEBP files are allowed'));
        }

        cb(null, true);
    },
});

module.exports = {
    uploadComplianceDocument: upload.single('document'),
};
