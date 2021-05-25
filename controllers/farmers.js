const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');


module.exports.renderFarmerPage = (req, res) => {
    res.render('farmers/farmerPage');
}

module.exports.renderInfoPage = (req, res) => {
    res.render('farmers/addInfo');
}

module.exports.addInfo = async (req, res)  => {
    const{farmArea} = req.body;
    const id = req.user._id;
    const user= await User.findByIdAndUpdate(id, {farmArea});
    await user.save();
    req.flash('success', 'Information Added Successfully!');
    res.redirect(`/farmer`)
}

module.exports.index = async (req, res) => {
    const products = await Product.find({quantity:{$gt:0}});
    res.render('farmers/allproducts', { products })
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
        return res.redirect('/farmer/products');
    }
    res.render('farmers/showProduct', { product });
}

module.exports.renderOrderPage = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).populate('supplier');
    res.render('farmers/orderPage',{product});
}

module.exports.orderProduct = async (req, res,next) => {
    const id = req.params.id;
    console.log(req.body.order);
    const order = new Order(req.body.order);
    const product = await Product.findById(id);
    product.quantity = product.quantity - order.quantity;
    await product.save();
    order.supplier = product.supplier;
    order.product = product._id
    order.farmer = req.user._id;
    order.status = "not out for delivery";
    await order.save();

    req.flash('success', 'Order Placed Successfully!');
    res.redirect('/farmer/products');
}


module.exports.showAllOrders = async (req, res) => {
    const id = req.user._id;
    const orders = await Order.find({farmer:id , status : {$in: ['not out for delivery', 'out for delivery','cancelled by supplier']}}).populate('supplier').populate('product');

    res.render('farmers/allOrders', { orders })

}


module.exports.showOrder = async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id).populate('supplier').populate('product');
    res.render('farmers/showOrder', { order })

}

module.exports.cancelOrder = async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id);
    const product = await Product.findById(order.product);
    product.quantity = product.quantity + order.quantity;

    order.status = "cancelled by farmer";
    order.save();
    product.save();
    req.flash('success', 'Order Cancelled Successfully!');
    res.redirect(`/farmer/orders`);
    
    

}


