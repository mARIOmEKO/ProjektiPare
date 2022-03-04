const express=require('express')
const router=express.Router();
const {authenticateUser,authorizePermissions} = require('../middleware/authentication')

const {
    getAllOrders,
    getSingleOrder,
    createOrder,
    getCurrentUserOrders,
    updateOrder,   
}= require('../controllers/orderController');

router.route('/').post(authenticateUser,createOrder);
router.route('/').get(authenticateUser,authorizePermissions('admin'),getAllOrders);
router.route('/showAllMyOrders').get(authenticateUser,getCurrentUserOrders);
router.route('/:id').get(authenticateUser,getSingleOrder);
router.route('/:id').patch(authenticateUser,updateOrder);

module.exports= router;