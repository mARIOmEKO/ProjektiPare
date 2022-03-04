const customError = require('../errors')

const checkPermissions= (requestUser,resourceUserId)=>{
    if (requestUser.role === 'admin') return;
    if (requestUser.userId === resourceUserId.toString()) return;
    throw new customError.UnautherziedError('Not authorized per te bere kte')
};

module.exports = checkPermissions;
