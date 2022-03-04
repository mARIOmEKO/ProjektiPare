const Product= require('../models/Product');
const CustomError = require('../errors');
const path = require('path')

const getAllProducts = async (req,res)=>{
    const products = await Product.find({});
    res.status(200).json({products});
}

const getSingleProduct = async (req,res)=>{
    const {id:productId} = req.params;
    const product = await Product.findOne({_id : productId}).populate('reviews');
    if(!product){
        throw new CustomError.NotFoundError('Ska produkt me ke emer')
    }
    res.status(200).json({product});
}

const createProduct = async (req,res)=>{
    req.body.user = req.user.userId;
    const product = await Product.create(req.body)
    res.status(201).json({product});
}

const updateProduct = async (req,res)=>{
    const {id:productId} = req.params;
    const product = await Product.findOneAndUpdate({_id:productId},req.body,{
        new: true,
        runValidators: true,
    })
    if(!product){
        throw new CustomError.NotFoundError('sKA PRODUKT ME KTE ID')
    }
    res.status(200).json({product});
}

const deleteProduct = async (req,res)=>{
    const {id:productId} = req.params;
    const product = await Product.findOne({_id : productId});
    if(!product){
        throw new CustomError.NotFoundError('Ska produkt me ke emer')
    }
    await product.remove();
    res.status(200).json({msg: 'u fshi me sukses'});
}

const uploadImage = async (req,res)=>{
    if(!req.files){
        throw new CustomError.BadRequestError('ska file bre vlla, beje upload mire')
    }
    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('image bre image, zgjidh image')
    }
    const maxSize = 1024 * 1024;
    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError('E KE SHUM TE MADH.. IMAZHIN (Ka kalu 1 MB)');
    }
    const imagePath = path.join(__dirname,'../public/uploads/'+ `${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(200).json({image: `/uploads/${productImage.name}`});
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    uploadImage,
    updateProduct,
    deleteProduct
}