const CustomError = require('../errors')
const {isTokenValid}=require('../utils')

const authenticateUser = async (req,res,next)=>{
    const token = req.signedCookies.refreshToken;

    if(!token){
        throw new CustomError.UnauthenticatedError('invalid authentication');
    }
    
    try {
        const {name,userId,role} = isTokenValid({token});
        req.user= {name,userId,role};
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('invalid authentication');
        
    }
};


const authorizePermissions=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
                throw new CustomError.UnautherziedError('SJE ADMIN O QYP KU SHKON');
            }
            next();
    }
};  

module.exports={
    authenticateUser,
    authorizePermissions,
}