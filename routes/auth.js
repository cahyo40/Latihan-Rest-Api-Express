const express = require('express');
const router = express.Router();
const {register,login,logout,getMyUser  } = require('../controllers/auth_controller');
const {authMiddleware} = require('../middleware/user_middleware');



router.post('/register',register);
router.post('/login',login);
router.get('/logout',authMiddleware,logout);
router.get('/me',authMiddleware,getMyUser);


module.exports = router;
