const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/create-product', upload.single('image'), productController.createProduct);

module.exports = router;
