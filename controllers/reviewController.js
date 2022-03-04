const Review= require('../models/Review');
const CustomError = require('../errors');
const Product = require('../models/Product')
const {checkPermissions}= require('../utils')

const createReview = async (req,res)=>{
    const {product:productId} = req.body;
    const isValidProduct = await Product.findOne({id:productId})
    if (!isValidProduct){
    throw new CustomError.NotFoundError('Su gjet produkt me kte id')
    }

    const alreadySubmitted = await Review.findOne({
        product:productId,
        user:req.user.userId
    })
    if(alreadySubmitted){
        throw new CustomError.BadRequestError('E ke bere nje preview po ik andej')
    }
    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(201).json({review})
};

const getAllReviews = async (req,res)=>{
    const reviews = await Review.find({}).populate({
        path: 'product',
        select : 'name company price',
    });
    res.status(200).json({reviews,count:reviews.length})
};

const getSingleReview = async (req,res)=>{
    const {id:reviewId}=req.params;
    const review = await Review.findOne({_id:reviewId});
    if(!review){
        throw new CustomError.NotFoundError('Ska review me kte id')
    }
    res.status(200).json({review})
};

const updateReview = async (req,res)=>{
    const {id:reviewId}=req.params;
    const {rating,title,comment}=req.body;

    const review = await Review.findOne({_id:reviewId});
    if(!review){
        throw new CustomError.NotFoundError('Ska review me kte id')
    }
    checkPermissions(req.user,review.user);
    review.rating= rating;
    review.title= title;
    review.comment= comment;

    await review.save();
    res.status(200).json({review})
};

const deleteReview = async (req,res)=>{
    const {id:reviewId}=req.params;
    const review = await Review.findOne({_id:reviewId});
    if(!review){
        throw new CustomError.NotFoundError('Ska review me kte id')
    }
    checkPermissions(req.user,review.user);
    await review.remove();
    res.status(200).json({msg:"review deleted"})
}  

const getSingleProductReviews =  async (req,res)=>{
    const {id:productId}=req.params;
    const reviews = await Review.find({product:productId})
    res.status(200).json({reviews,count:reviews.length})
}


module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}