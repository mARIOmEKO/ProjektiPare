const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        required:[true,'vir nje rating o qyp'],
        min: 1,
        max: 5,
    },
    title:{
        type:String,
        required:[true,'vir nje titull bre'],
        trim:true,
        maxlength: 80,
    },
    comment: {
        type: String,
        required : true,
    },
    user: {
        type : mongoose.Schema.ObjectId,
        ref:'User',
        required: true,
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    }
},
{timestamps:true}
);
ReviewSchema.index({product:1,user:1}, {unique: true});

ReviewSchema.statics.calculateAverageRating = async function(productId){
    const result = await this.aggregate([
        {$match:{product:productId}},
        {$group:{
            _id:'$product',
            averageRating :{$avg:'$rating'},
            numOfReviews:{$sum:1},
        }}
    ]) 
    console.log(result);
    try {
        await this.model('Product').findOneAndUpdate(
            {_id:productId},
            {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0,

        });
    } catch (error) {
        console.log(error);
    }
}   
ReviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product);
})

ReviewSchema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.product);
})

module.exports = mongoose.model('Review',ReviewSchema);