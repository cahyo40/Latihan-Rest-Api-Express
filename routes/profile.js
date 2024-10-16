const express = require('express');
const router = express.Router();
const {updateOrCreateProfile,uploadImage} = require('../controllers/profile_controller');
const {authMiddleware} = require('../middleware/user_middleware');
const { upload } = require('../utils/uploads');

router.post('/', authMiddleware, updateOrCreateProfile);
router.post('/upload', authMiddleware, upload.single('image'), uploadImage);

module.exports = router;
