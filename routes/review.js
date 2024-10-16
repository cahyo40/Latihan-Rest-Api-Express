const express = require('express');
const router = express.Router();
const {createOrUpdateReview} = require('../controllers/review_controller')
const {authMiddleware} = require('../middleware/user_middleware');


router.post('/:product_id',authMiddleware, createOrUpdateReview)



module.exports = router;
