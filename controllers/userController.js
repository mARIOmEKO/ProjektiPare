const User= require('../models/User');
const CustomError = require('../errors');
const {checkPermissions,createTokenUser,attachCookiesToResponse}= require('../utils')

const getAllUsers = async (req,res)=>{
    console.log(req.user)
    const users = await User.find({role:'user'}).select('-password')
    res.status(200).json({users})
};

const getSingleUser = async (req,res)=>{
    const user = await User.findOne({_id:req.params.id}).select('-password')
    if (!user){
        throw new CustomError.NotFoundError(`no user with id : ${req.params.id}`)
    }
    checkPermissions(req.user,user._id)
    res.status(200).json({user});    
};

const showCurrentUser = async (req,res)=>{
    res.status(200).json({user:req.user})
}
//update user with user.save
const updateUser = async (req,res)=>{
    const {email,name}=req.body;
    if(!name || !email){
        throw new CustomError.BadRequestError('futi te dyja bre');
    }
    const user = await User.findOne({_id:req.user.userId})
    user.email = email;
    user.name = name;
    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(200).json({user:tokenUser})

}

const updateUserPassword = async (req,res)=>{
    const{oldPassword,newPassword} = req.body
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError('fUTi passwordet bre');
    }
    const user = await User.findOne({_id:req.user.userId})
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('INVALID PASSWORD');
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({msg : "passwordi u ndryshua"})
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}


// update with findOneandUpdate
// const updateUser = async (req,res)=>{
//     const {email,name}=req.body;
//     if(!name || !email){
//         throw new CustomError.BadRequestError('futi te dyja bre');
//     }
//     const user = await User.findOneAndUpdate(
//         {_id:req.user.userId},
//         {name,email},
//         {new:true, runValidators:true}
//     );
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({res,user:tokenUser});
//     res.status(200).json({user:tokenUser})

// }