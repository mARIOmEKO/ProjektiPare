const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'vir nje emer'],
        trim: true,
        maxlength: 80,
    },
    price:{
        type:Number,
        required:[true,'vir nje cmim'],
        default:0,
    },
    description:{
        type:String,
        required:[true,'vir nje description'],
        maxlength:1000,
    },
    image:{
        type:String,
        required:true,
        default: '/uploads/example.jpeg',
    },
    category:{
        type : String,
        required : true,
        enum : ['office','kitchen','bedroom'],
    },
    company:{
        type : String,
        required : true,
        enum : {
            values : ['ikea','liddy','marcos'],
            message : '{VALUE} is not supported',
        },
    },
    colors : {
        type : [String],
        default : ['#222'],
        required: true,

    },
    featured : {
        type: Boolean,
        default : false,
    },
    freeShipping:{
        type: Boolean,
        default : false,
    },
    inventory:{
        type : Number,
        required : true,
        default: 15,
    },
    averageRating:{
        type : Number,
        default : 0,
    },
    numOfReviews:{
        type : Number,
        default : 0,
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },

    },
    {timestamps: true,toJSON:{virtuals:true},toObject:{virtuals:true}}
);


ProductSchema.virtual('reviews',{
    ref:'Review',
    localField: '_id',
    foreignField: 'product',
    justOne : false,
    match:{rating:1},
})

ProductSchema.pre('remove',async function(next){
    await this.model('Review').deleteMany({product:this._id})
});



module.exports=mongoose.model('Product',ProductSchema);