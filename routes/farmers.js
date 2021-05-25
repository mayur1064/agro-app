const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const farmers = require('../controllers/farmers');
const { isLoggedIn,gaveInfo} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



router.route('/addInfo')
    .get(isLoggedIn,farmers.renderInfoPage)
    .post(isLoggedIn,farmers.addInfo)
    




router.route('/products/:id/order')
    .get(isLoggedIn,farmers.renderOrderPage)
    .post(isLoggedIn, catchAsync(farmers.orderProduct))

// router.route('/products/order')
//     .post(isLoggedIn, catchAsync(farmers.orderProduct))


router.route('/products/:id')
    .get(isLoggedIn,farmers.showProduct)

router.route('/products')
    .get(isLoggedIn,farmers.index)


    
router.route('/')
    .get(isLoggedIn, gaveInfo, farmers.renderFarmerPage)
    //.post(catchAsync(suppliers.register));


router.route('/orders/:id/cancel')
    .post(isLoggedIn,farmers.cancelOrder)

router.route('/orders/:id')
    .get(isLoggedIn, gaveInfo, farmers.showOrder)

router.route('/orders')
    .get(isLoggedIn, gaveInfo, farmers.showAllOrders)
    //.post(catchAsync(suppliers.register));


// router.route('/login')
//     .get(users.renderLogin)
//     .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// router.get('/logout', users.logout)

    


module.exports = router;