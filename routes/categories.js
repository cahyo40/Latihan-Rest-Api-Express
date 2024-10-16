const express = require('express');
const router = express.Router();
const {findAll,createCategory,findCategoryById,deleteCategoryById,updateCategoryById} = require('../controllers/categories_controller');


const {authMiddleware,isAdmin} = require('../middleware/user_middleware');


router.use(authMiddleware);

router.get('/',isAdmin,findAll);
router.post('/',createCategory);
router.get('/:id',findCategoryById);
router.delete('/:id',deleteCategoryById);
router.put('/:id',updateCategoryById);

       
module.exports = router;