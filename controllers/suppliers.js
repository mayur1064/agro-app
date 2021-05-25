//const Supplier = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const { cloudinary } = require("../cloudinary");


module.exports.renderSupplierPage = (req, res) => {
    res.render('suppliers/supplierPage');
}

module.exports.index = async (req, res) => {
    const products = await Product.find({supplier:req.user._id});
    res.render('suppliers/allproducts', { products })
}


module.exports.showProduct = async (req, res,) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('supplier');
    if (!product) {
        req.flash('error', 'Cannot find the Product!');
        return res.redirect('/supplier/products');
    }
    res.render('suppliers/showProduct', { product });
}

module.exports.renderNewProductForm = (req, res) => {
    res.render('suppliers/newProduct');
}


module.exports.createProduct = async (req, res, next) => {
    const product = new Product(req.body.product);
    //console.log(product);
    product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.supplier = req.user._id;
    product.ratingSum = 0;
    product.reviewCount = 0;
    await product.save();
    //console.log(product);
    req.flash('success', 'Product Added Successfully!');
    res.redirect(`/supplier/products/${product._id}`)
}



module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    if (!product) {
        req.flash('error', 'Cannot find the Product!');
        return res.redirect('/supplier/products');
    }
    res.render('suppliers/editProduct', { product });
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.images.push(...imgs);
    await product.save();
    
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    
    req.flash('success', 'Product updated Successfully!');
    res.redirect(`/supplier/products/${product._id}`)
}

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    for (let image of product.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    await Product.findByIdAndDelete(id);
    await Order.deleteMany({product:id});

    req.flash('success', 'Product Deleted Successfully!')
    res.redirect('/supplier/products');
}

module.exports.showAllOrders = async (req, res) => {
    const id = req.user._id;
    const orders = await Order.find({supplier:id , status : {$in: ['not out for delivery', 'out for delivery','cancelled by farmer']}}).populate('farmer').populate('product');

    res.render('suppliers/allOrders', { orders })

}

module.exports.showOrder = async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id).populate('farmer').populate('product');
    res.render('suppliers/showOrder', { order })

}

module.exports.updateStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    const order = await Order.findById(id);
    if(status === "delivery")
    {
        if(order.status === "not out for delivery")
        {
            order.status = "out for delivery"
        }
        else
        {
            order.status = "not out for delivery"
        }
        order.save();
        res.redirect(`/supplier/orders/${id}`);
    }
    else if(status === "cancel")
    {
        order.status = "cancelled by supplier";
        const product = await Product.findById(order.product);
        product.quantity = product.quantity + order.quantity;    
        order.save();
        product.save();
        req.flash('success', 'Order Cancelled Successfully!');
        res.redirect(`/supplier/orders`);
    }
    
    

}


// module.exports.renderNewForm = (req, res) => {
//     res.render('suppliers/newProduct');
// }



// module.exports.renderRegister = (req, res) => {
//     res.render('suppliers/register');
// }

// module.exports.renderRegisterFarmer = (req, res) => {
//     res.render('suppliers/registerFarmer');
// }

// module.exports.register = async (req, res, next) => {
//     try {
//         const { email, username, password, contact, address, city } = req.body;
//         const supplier = new Supplier({ email, username, contact, address, city  });
//         const registeredSupplier = await Supplier.register(supplier, password);
//         console.log("test1")
//         req.login(registeredSupplier, err => {
//             if (err) return next(err);
//             req.flash('success', 'Welcome to Agro App!');
//             res.redirect('/supplier/shop');
//         })
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('supplier/register');
//     }
// }

// module.exports.registerFarmer = async (req, res, next) => {
//     try {
//         const { email, username, password, contact, farmArea, city } = req.body;
//         const farmer = new Farmer({ email, username, contact, farmArea, city  });
//         const registeredFarmer = await Farmer.register(farmer, password);
//         console.log("test1")
//         req.login(registeredFarmer, err => {
//             if (err) return next(err);
//             req.flash('success', 'Welcome to Agro App!');
//             res.redirect('/supplier/shop');
//         })
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('supplier/register');
//     }
// }

// module.exports.renderLogin = (req, res) => {
//     res.render('suppliers/login');
// }

// module.exports.login = (req, res) => {
//     req.flash('success', `welcome back! ${req.user.username} `);
//     const redirectUrl = /*req.session.returnTo ||*/ '/products';
//     delete req.session.returnTo;
//     res.redirect(redirectUrl);
// }

// module.exports.loginFarmer = (req, res) => {
//     req.flash('success', `welcome back! ${req.user.username} `);
//     const redirectUrl = /*req.session.returnTo ||*/ '/products';
//     delete req.session.returnTo;
//     res.redirect(redirectUrl);
// }

// module.exports.logout = (req, res) => {
//     req.logout();
//     req.flash('success', "Goodbye!");
//     res.redirect('/');
// }

// module.exports.renderShop = async (req, res) => {
//     const products = await Product.find({});
//     res.render('suppliers/shop', { products })
// }

// module.exports.renderNewForm = (req, res) => {
//     res.render('suppliers/newProduct');
// }

// module.exports.createProduct = async (req, res, next) => {
//     const product = new Product(req.body.product);
//     console.log(product);
//     product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     product.supplier = req.user._id;
//     await product.save();
//     console.log(product);
//     req.flash('success', 'Product Added Successfully!');
//     res.redirect(`/supplier/shop/${product._id}`)
// }

// module.exports.showProduct = async (req, res,) => {
//     const product = await Product.findById(req.params.id)/*.populate({
//         path: 'reviews',
//         populate: {
//             path: 'author'
//         }
//     })*/.populate('supplier');
//     if (!product) {
//         req.flash('error', 'Cannot find the Product!');
//         return res.redirect('/supplier/shop');
//     }
//     res.render('supplier/showProduct', { product });
// }




