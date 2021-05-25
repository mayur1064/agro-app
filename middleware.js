//const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Product = require('./models/product');
const User = require('./models/user');
const Review = require('./models/review');

//const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/user/login');
    }
    next();
}

module.exports.gaveInfo = async (req, res, next) => {
    const id = req.user._id;
    const user = await User.findById(id);
    if(!user.farmArea)
    {
        req.flash('error', 'Please provide the Below Information');
        return res.redirect('/farmer/addInfo'); 
    }
    next();
}


// module.exports.isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const product = await Product.findById(id);
//     if (!product.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/farmer/products/${id}`);
//     }
//     next();
// }

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/farmer/products/${id}`);
    }
    next();
}

// module.exports.validateCampground = (req, res, next) => {
//     const { error } = campgroundSchema.validate(req.body);
//     console.log(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

// module.exports.isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     if (!campground.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

// module.exports.isReviewAuthor = async (req, res, next) => {
//     const { id, reviewId } = req.params;
//     const review = await Review.findById(reviewId);
//     if (!review.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

// module.exports.validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }