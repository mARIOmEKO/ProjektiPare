const Review= require('../models/Order');
const CustomError = require('../errors');
const Product = require('../models/Product')
const {checkPermissions}= require('../utils');
const Order = require('../models/Order');

const fakeStripeAPI = async ({amount,currency})=>{
    const client_secret = 'RandomValue'
    return {client_secret,amount}
}
const createOrder = async (req,res)=>{
    const {items:cartItems,tax,shippingFee}=req.body;
    if (!cartItems || cartItems.length<1){
        throw new CustomError.BadRequestError('No cart itmes provided')
    }
    if (!tax || !shippingFee){
        throw new CustomError.BadRequestError('no tax or shiping fee');
    }
let orderItems = [];
let subtotal = 0;

for(const item of cartItems){
    const dbProduct = await Product.findOne({_id:item.product})
    if (!dbProduct){
        throw new CustomError.NotFoundError(`No product with id : ${item.product}`);
    }
    const {name,price,image,_id}= dbProduct;   
    const singleOrderItem = {
        amount:item.amount,
        name,
        price,
        image,
        product:_id,
    };
    console.log(singleOrderItem)
    // add item to order
    orderItems = [...orderItems,singleOrderItem]
    console.log(orderItems)
    //calculate subtotal
    subtotal += item.amount * price;
}
const total = tax + shippingFee +subtotal;
const paymentIntent = await fakeStripeAPI({
    amount : total,
    currency: 'usd',
})
const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret:paymentIntent.client_secret,
    user :req.user.userId,
})
res.status(201).json({order,clientSecret:order.clientSecret})
}
const getAllOrders = async (req,res)=>{
    const orders = await Order.find({});
    res.status(200).json({orders}); 
} 
const getSingleOrder = async (req,res)=>{
    const {id:orderId} = req.params
    const order = await Order.findOne({_id:orderId})
    if (!order){
        throw new CustomError.NotFoundError('ska order me kte id')
    }
    checkPermissions(req.user,order.user)
    res.status(200).json({order})
} 
const getCurrentUserOrders = async (req,res)=>{
    const orders = await Order.find({user:req.user.userId})
    res.status(200).json({orders,count : orders.length})
} 
const updateOrder = async (req,res)=>{
    const {id:orderId}=req.params;
    const {paymentIntentId}= req.body;
    const order = await Order.findOne({_id:orderId});
    if (!order){
        throw new CustomError.NotFoundError('no order me kte id')
    }
    checkPermissions(req.user,order.user)
    order.paymentIntentId = paymentIntentId
    order.status='paid'
    await order.save();
    res.status(200).json({order})
}





module.exports = {
    getAllOrders,
    getSingleOrder,
    createOrder,
    getCurrentUserOrders,
    updateOrder,
    
}