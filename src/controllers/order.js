const Order_model = require('../models/order');

    function addOrder(body) {
    return Order_model.create(body)
}
function orderDelete(id) {
    return Order_model.deleteOne({ _id: id })
}
// function updateOrder(id ,s) {
//     // return Order_model.updateOne({ _id: id })
//     return Order_model.findOneAndUpdate({ _id: id },{status:s},{new:true})

// }
function getOrderItems(id) {
    return Order_model.findOne({ _id: id }).populate('user').populate('products.product') 
}
function getOrderItemsByUserID(id) {
    return Order_model.find({ user: id }).populate('user').populate('products.product') 
}
function getAllOrders() {
    return Order_model.find().populate('user').populate('products.product')
}
function updatetoComplete(orderId) {
    return Order_model.findOneAndUpdate({_id:orderId},{status:"completed"},{new:true}).populate('user').populate('products.product')
}
function updatetocancelled(orderId) {
    return Order_model.findOneAndUpdate({_id:orderId},{status:"cancelled"},{new:true}).populate('user').populate('products.product')
}




module.exports = { addOrder, orderDelete, getOrderItems, getOrderItemsByUserID , getAllOrders ,updatetoComplete,updatetocancelled  }