const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const suppliers = require('../controllers/suppliers');
const { isLoggedIn} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(isLoggedIn,suppliers.renderSupplierPage)
    //.post(catchAsync(suppliers.register));


router.route('/products/new')
    .get(isLoggedIn,suppliers.renderNewProductForm)

router.get('/products/:id/edit', isLoggedIn, /*isAuthor,*/ catchAsync(suppliers.renderEditForm))

router.route('/products/:id')
    .get(isLoggedIn,suppliers.showProduct)
    .put(isLoggedIn, /*isAuthor,*/ upload.array('image'), /*validateCampground,*/ catchAsync(suppliers.updateProduct))
    .delete(isLoggedIn, /*isAuthor,*/catchAsync(suppliers.deleteProduct));


router.route('/orders/:id/:status')
    .post(isLoggedIn,suppliers.updateStatus)

    

router.route('/orders/:id')
    .get(isLoggedIn,suppliers.showOrder)
    
router.route('/orders')
    .get(isLoggedIn,suppliers.showAllOrders)
    




router.route('/products')
    .get(isLoggedIn,suppliers.index)
    .post(isLoggedIn, upload.array('image'), catchAsync(suppliers.createProduct))

    
    


module.exports = router;