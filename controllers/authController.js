const User=require('../models/User');
const {StatusCodes}=require('http-status-codes');
const CustomError = require('../errors');
const {createTokenUser,attachCookiesToResponse}=require('../utils')


const register = async (req,res)=>{
    const {email,name,password}=req.body;
    const emailAlreadyExists = await User.findOne({email});
    if (emailAlreadyExists){
        throw new CustomError.BadRequestError('Email already exists')
    }
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin':'user';
    
    const user = await User.create({name,password,email,role});
    const tokenUser = createTokenUser(user);
    
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser,})
}

const login = async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new CustomError.BadRequestError('fUT EMAIL DHE PASSWORD')
    }
    const user= await User.findOne({email});
    if (!user){
        throw new CustomError.UnauthenticatedError('SKA USER ME KTE EMAIL')
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('wrong pass bro, try again')
    }
    const tokenUser = createTokenUser(user);
    
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser,})
}

const logout = async (req,res)=>{
    res.cookie('refreshToken','logout',{
        httpOnly:true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg:'u kry logout'});
}

module.exports = {
    register,
    login,
    logout,
};