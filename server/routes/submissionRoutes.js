const express = require('express');
const router = express.Router();
const { submitTask, getSubmission } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Intentional gap: no role guard — any authenticated user can submit
// Intentional gap: upload.single('file') runs before ownership checks,
// so the file is saved to disk even if the request is later rejected
router.post('/:taskId', protect, upload.single('file'), submitTask);
router.get('/:taskId', protect, getSubmission);

module.exports = router;
