const express = require('express');
const router = express.Router();

const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product_controller');
const { upload } = require('../utils/uploads');


router.post('/', upload.single('image'), addProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);


module.exports = router;